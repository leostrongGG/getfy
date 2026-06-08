<?php

namespace App\Services;

use App\Exceptions\ExistingPixCheckoutRedirect;
use App\Models\Order;
use App\Models\Product;
use App\Support\CheckoutTurnstileSettings;
use App\Support\PendingPixCheckoutResolver;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException;

class CheckoutAbuseGuard
{
    public function __construct(
        private readonly TurnstileVerifier $turnstile
    ) {}

    public function isEnabled(): bool
    {
        return (bool) config('checkout_security.enabled', true);
    }

    public function honeypotField(): string
    {
        return (string) config('checkout_security.honeypot_field', 'website');
    }

    public function honeypotTriggered(Request $request): bool
    {
        $field = $this->honeypotField();
        $value = $request->input($field);

        return is_string($value) && trim($value) !== '';
    }

    /**
     * @return array{requires_captcha: bool, turnstile_site_key: ?string}
     */
    public function securityPropsForRequest(Request $request, ?Product $product = null): array
    {
        if (! $this->isEnabled()) {
            return ['requires_captcha' => false, 'turnstile_site_key' => null];
        }

        $requires = $this->requiresCaptcha($request, $product);
        $siteKey = $this->turnstileSiteKey();

        return [
            'requires_captcha' => $requires && $this->turnstile->isConfigured(),
            'turnstile_site_key' => ($requires && $siteKey !== '') ? $siteKey : null,
        ];
    }

    public function requiresCaptcha(Request $request, ?Product $product = null): bool
    {
        if (! $this->isEnabled()) {
            return false;
        }

        $paymentMethod = strtolower((string) $request->input('payment_method', ''));

        if (CheckoutTurnstileSettings::isEnabled()) {
            return CheckoutTurnstileSettings::requiresTokenForPaymentMethod($paymentMethod);
        }

        $mode = strtolower((string) config('checkout_security.captcha.mode', 'adaptive'));
        if ($mode === 'off' || ! $this->turnstile->isConfigured()) {
            return false;
        }
        if ($mode === 'always') {
            return true;
        }

        $softAttempts = max(1, (int) config('checkout_security.captcha.soft_attempts', 2));
        $windowMinutes = max(1, (int) config('checkout_security.captcha.soft_window_minutes', 10));

        $ipKey = $this->attemptCacheKey('ip', $request->ip(), $product?->id);
        $ipAttempts = (int) Cache::get($ipKey, 0);

        if ($ipAttempts >= $softAttempts) {
            return true;
        }

        $email = $this->normalizeEmail($request->input('email'));
        if ($email !== '') {
            $emailKey = $this->attemptCacheKey('email', $email, $product?->id);
            $emailAttempts = (int) Cache::get($emailKey, 0);
            if ($emailAttempts >= $softAttempts) {
                return true;
            }
        }

        return RateLimiter::tooManyAttempts('checkout-captcha-required:'.$request->ip(), 1);
    }

    public function recordAttempt(Request $request, ?Product $product = null): void
    {
        if (! $this->isEnabled()) {
            return;
        }

        $windowMinutes = max(1, (int) config('checkout_security.captcha.soft_window_minutes', 10));
        $ttl = now()->addMinutes($windowMinutes);

        $ipKey = $this->attemptCacheKey('ip', $request->ip(), $product?->id);
        Cache::put($ipKey, (int) Cache::get($ipKey, 0) + 1, $ttl);

        $email = $this->normalizeEmail($request->input('email'));
        if ($email !== '') {
            $emailKey = $this->attemptCacheKey('email', $email, $product?->id);
            Cache::put($emailKey, (int) Cache::get($emailKey, 0) + 1, $ttl);
        }
    }

    public function clearAttempts(Request $request, ?Product $product = null): void
    {
        Cache::forget($this->attemptCacheKey('ip', $request->ip(), $product?->id));
        $email = $this->normalizeEmail($request->input('email'));
        if ($email !== '') {
            Cache::forget($this->attemptCacheKey('email', $email, $product?->id));
        }
        RateLimiter::clear('checkout-captcha-required:'.$request->ip());
    }

    public function markCaptchaRequired(Request $request): void
    {
        RateLimiter::hit('checkout-captcha-required:'.$request->ip(), 60 * 30);
    }

    public function floodPixAttemptCount(Request $request): int
    {
        if (! $this->isPixCheckoutRequest($request)) {
            return 0;
        }

        return (int) Cache::get($this->floodPixCacheKey($request), 0);
    }

    public function isFloodPixThresholdExceeded(Request $request): bool
    {
        $threshold = max(1, (int) config('checkout_security.flood.pix_attempts_per_minute', 2));

        return $this->floodPixAttemptCount($request) > $threshold;
    }

    public function assertCanCreateCheckout(Request $request, ?Product $product): void
    {
        if (! $this->isEnabled()) {
            return;
        }

        if ($this->honeypotTriggered($request)) {
            throw new TooManyRequestsHttpException(60, 'Muitas tentativas. Aguarde e tente novamente.');
        }

        if ($this->requiresCaptcha($request, $product)) {
            $result = $this->turnstile->verify($request);
            if (! $result['ok']) {
                $this->markCaptchaRequired($request);
                throw ValidationException::withMessages([
                    'cf-turnstile-response' => ['Confirme que você não é um robô para continuar.'],
                ]);
            }
        }

        $this->assertFloodPixReuse($request);
        $this->assertPendingLimits($request, $product);
    }

    public function assertFloodPixReuse(Request $request): void
    {
        if (! $this->isEnabled() || ! $this->isPixCheckoutRequest($request)) {
            return;
        }

        $key = $this->floodPixCacheKey($request);
        $count = (int) Cache::get($key, 0) + 1;
        Cache::put($key, $count, now()->addMinute());

        if ($count > max(1, (int) config('checkout_security.flood.pix_attempts_per_minute', 2))) {
            $this->tryRedirectToExistingPixRelaxed($request);
        }
    }

    public function assertPendingLimits(Request $request, ?Product $product = null): void
    {
        $this->tryRedirectToExistingPix($request);

        $lookbackHours = max(1, (int) config('checkout_security.pending.lookback_hours', 1));
        $since = now()->subHours($lookbackHours);

        $maxIp = max(1, (int) config('checkout_security.pending.max_per_ip_hour', 10));
        $ip = $request->ip();
        if ($ip) {
            $ipCount = Order::query()
                ->where('status', 'pending')
                ->where('customer_ip', $ip)
                ->where('created_at', '>=', $since)
                ->count();
            if ($ipCount >= $maxIp) {
                $this->tryRedirectToExistingPix($request);
                $this->tryRedirectToExistingPixRelaxed($request);
                $this->markCaptchaRequired($request);
                throw new TooManyRequestsHttpException(300, 'Muitas tentativas de pagamento. Aguarde alguns minutos.');
            }
        }

        $maxEmail = max(1, (int) config('checkout_security.pending.max_per_email_hour', 6));
        $email = $this->normalizeEmail($request->input('email'));
        if ($email !== '') {
            $emailCount = Order::query()
                ->where('status', 'pending')
                ->where('email', $email)
                ->where('created_at', '>=', $since)
                ->count();
            if ($emailCount >= $maxEmail) {
                $this->tryRedirectToExistingPix($request);
                $this->tryRedirectToExistingPixRelaxed($request);
                $this->markCaptchaRequired($request);
                throw new TooManyRequestsHttpException(300, 'Muitas tentativas de pagamento para este e-mail. Aguarde alguns minutos.');
            }
        }
    }

    private function tryRedirectToExistingPix(Request $request): void
    {
        $order = PendingPixCheckoutResolver::findReusable($request);
        if ($order) {
            throw new ExistingPixCheckoutRedirect($order, $request);
        }
    }

    private function tryRedirectToExistingPixRelaxed(Request $request): void
    {
        $order = PendingPixCheckoutResolver::findReusableRelaxed($request);
        if ($order) {
            throw new ExistingPixCheckoutRedirect($order, $request, relaxed: true);
        }
    }

    private function isPixCheckoutRequest(Request $request): bool
    {
        return PendingPixCheckoutResolver::isPixLikePaymentMethod($request->input('payment_method'));
    }

    private function floodPixCacheKey(Request $request): string
    {
        $email = $this->normalizeEmail($request->input('email'));
        $productId = trim((string) $request->input('product_id', ''));

        return 'checkout_flood_pix:'.sha1($email.'|'.$productId);
    }

    private function turnstileSiteKey(): string
    {
        return CheckoutTurnstileSettings::siteKeyForCheckout();
    }

    private function attemptCacheKey(string $type, string $value, ?string $productId): string
    {
        $normalized = strtolower(trim($value));
        $pid = $productId ? (string) $productId : 'any';

        return 'checkout_abuse_attempts:'.$type.':'.sha1($normalized.'|'.$pid);
    }

    private function normalizeEmail(mixed $email): string
    {
        if (! is_string($email)) {
            return '';
        }

        return strtolower(trim($email));
    }
}
