<?php

namespace Tests\Feature;

use App\Http\Middleware\EnsureInstalled;
use App\Models\Setting;
use App\Models\User;
use App\Support\CheckoutTurnstileSettings;
use Tests\TestCase;

class CheckoutSecurityIntegrationTest extends TestCase
{
    public function test_checkout_security_settings_can_be_saved_from_integrations(): void
    {
        $this->withoutMiddleware(EnsureInstalled::class);

        $user = User::factory()->create([
            'role' => User::ROLE_INFOPRODUTOR,
            'tenant_id' => 1,
        ]);

        $response = $this->actingAs($user)->putJson('/integracoes/checkout-security', [
            'checkout_turnstile_enabled' => true,
            'checkout_turnstile_site_key' => '0xTEST_SITE',
            'checkout_turnstile_secret_key' => '0xTEST_SECRET',
            'checkout_turnstile_mode' => CheckoutTurnstileSettings::MODE_PIX_BOLETO,
        ]);

        $response->assertOk();
        $this->assertSame('1', Setting::get('checkout_turnstile_enabled', null, null));
        $this->assertSame('0xTEST_SITE', Setting::get('checkout_turnstile_site_key', null, null));
        $this->assertSame(CheckoutTurnstileSettings::MODE_PIX_BOLETO, Setting::get('checkout_turnstile_mode', null, null));
        $this->assertTrue(CheckoutTurnstileSettings::isEnabled());
        $this->assertTrue(CheckoutTurnstileSettings::requiresTokenForPaymentMethod('pix'));
        $this->assertFalse(CheckoutTurnstileSettings::requiresTokenForPaymentMethod('card'));
    }

    public function test_integrations_index_includes_checkout_security_settings(): void
    {
        $this->withoutMiddleware(EnsureInstalled::class);

        Setting::set('checkout_turnstile_enabled', '1', null);
        Setting::set('checkout_turnstile_site_key', '0xSITE', null);
        Setting::set('checkout_turnstile_secret_key', encrypt('secret'), null);
        Setting::set('checkout_turnstile_mode', CheckoutTurnstileSettings::MODE_PIX_BOLETO, null);

        $user = User::factory()->create([
            'role' => User::ROLE_INFOPRODUTOR,
            'tenant_id' => 1,
        ]);

        $response = $this->actingAs($user)->get('/integracoes');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Integrations/Index')
            ->has('checkout_security_settings')
            ->where('checkout_security_settings.checkout_turnstile_site_key', '0xSITE')
            ->where('checkout_security_settings.checkout_turnstile_active', true)
        );
    }
}
