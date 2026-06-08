<?php

namespace App\Support;

use App\Models\Setting;

/**
 * Configuração global do Turnstile no checkout (painel Integrações).
 */
final class CheckoutTurnstileSettings
{
    public const MODE_DISABLED = 'disabled';

    public const MODE_PIX_BOLETO = 'pix_boleto';

    public const MODE_ALL_PAYMENTS = 'all_payments';

    public const MODES = [
        self::MODE_DISABLED,
        self::MODE_PIX_BOLETO,
        self::MODE_ALL_PAYMENTS,
    ];

    /**
     * @return array{enabled: bool, site_key: string, mode: string}
     */
    public static function publicConfig(): array
    {
        $panelEnabled = Setting::get('checkout_turnstile_enabled', '0', null) === '1';
        $panelSiteKey = trim((string) Setting::get('checkout_turnstile_site_key', '', null));
        $panelSecret = self::panelSecretKey();
        $mode = trim((string) Setting::get('checkout_turnstile_mode', self::MODE_PIX_BOLETO, null));
        if (! in_array($mode, self::MODES, true)) {
            $mode = self::MODE_PIX_BOLETO;
        }

        return [
            'enabled' => $panelEnabled && $panelSiteKey !== '' && $panelSecret !== '',
            'site_key' => $panelSiteKey,
            'mode' => $mode,
        ];
    }

    public static function isEnabled(): bool
    {
        return self::publicConfig()['enabled'];
    }

    public static function secretKey(): string
    {
        if (self::isEnabled()) {
            return self::panelSecretKey();
        }

        return trim((string) config('checkout_security.captcha.secret_key', ''));
    }

    public static function siteKeyForCheckout(): string
    {
        if (self::isEnabled()) {
            return self::publicConfig()['site_key'];
        }

        return trim((string) config('checkout_security.captcha.site_key', ''));
    }

    public static function requiresTokenForPaymentMethod(string $paymentMethod): bool
    {
        if (! self::isEnabled()) {
            return false;
        }

        $mode = self::publicConfig()['mode'];
        if ($mode === self::MODE_DISABLED) {
            return false;
        }
        if ($mode === self::MODE_ALL_PAYMENTS) {
            return true;
        }

        return in_array(strtolower($paymentMethod), ['pix', 'pix_auto', 'boleto'], true);
    }

    /**
     * @return array<string, mixed>
     */
    public static function forSettingsForm(): array
    {
        $public = self::publicConfig();
        $hasSecret = self::panelSecretKey() !== '';

        return [
            'checkout_turnstile_enabled' => Setting::get('checkout_turnstile_enabled', '0', null) === '1' ? '1' : '0',
            'checkout_turnstile_site_key' => trim((string) Setting::get('checkout_turnstile_site_key', '', null)),
            'checkout_turnstile_mode' => trim((string) Setting::get('checkout_turnstile_mode', self::MODE_PIX_BOLETO, null)),
            'checkout_turnstile_secret_configured' => $hasSecret,
            'checkout_turnstile_active' => $public['enabled'],
        ];
    }

    public static function storeSecret(?string $plain): void
    {
        if ($plain === null || trim($plain) === '') {
            return;
        }
        Setting::set('checkout_turnstile_secret_key', encrypt(trim($plain)), null);
    }

    private static function panelSecretKey(): string
    {
        $raw = Setting::get('checkout_turnstile_secret_key', '', null);
        if (! is_string($raw) || trim($raw) === '') {
            return '';
        }
        try {
            return trim((string) decrypt($raw));
        } catch (\Throwable) {
            return trim($raw);
        }
    }
}
