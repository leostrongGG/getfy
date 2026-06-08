<?php

namespace App\Http\Controllers\Integrations;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Support\CheckoutTurnstileSettings;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CheckoutSecurityController extends Controller
{
    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'checkout_turnstile_enabled' => ['nullable', 'boolean'],
            'checkout_turnstile_site_key' => ['nullable', 'string', 'max:255'],
            'checkout_turnstile_secret_key' => ['nullable', 'string', 'max:512'],
            'checkout_turnstile_mode' => ['nullable', 'string', 'in:disabled,pix_boleto,all_payments'],
        ]);

        if (array_key_exists('checkout_turnstile_enabled', $validated)) {
            Setting::set(
                'checkout_turnstile_enabled',
                ($validated['checkout_turnstile_enabled'] ?? false) ? '1' : '0',
                null
            );
        }

        if (array_key_exists('checkout_turnstile_site_key', $validated)) {
            Setting::set(
                'checkout_turnstile_site_key',
                trim((string) ($validated['checkout_turnstile_site_key'] ?? '')),
                null
            );
        }

        if (array_key_exists('checkout_turnstile_mode', $validated) && $validated['checkout_turnstile_mode'] !== null) {
            Setting::set('checkout_turnstile_mode', (string) $validated['checkout_turnstile_mode'], null);
        }

        CheckoutTurnstileSettings::storeSecret($validated['checkout_turnstile_secret_key'] ?? null);

        return response()->json([
            'settings' => CheckoutTurnstileSettings::forSettingsForm(),
        ]);
    }
}
