<?php

namespace Tests\Unit;

use App\Models\Order;
use App\Models\Setting;
use App\Models\User;
use App\Services\UtmifyService;
use App\Support\OrderReportingAmounts;
use Tests\TestCase;

class OrderReportingAmountsTest extends TestCase
{
    public function test_total_cents_brl_uses_settlement_from_cajupay_metadata(): void
    {
        $user = User::factory()->create();
        $product = $this->createTestProduct();

        $order = Order::create([
            'tenant_id' => 1,
            'user_id' => $user->id,
            'product_id' => $product->id,
            'status' => 'completed',
            'amount' => 4.86,
            'currency' => 'USD',
            'email' => 'intl@example.com',
            'metadata' => [
                'settlement_amount_cents' => 2700,
                'settlement_currency' => 'BRL',
                'fx_rate' => '5.555555',
            ],
        ]);

        $this->assertSame(2700, OrderReportingAmounts::totalCentsBrl($order));
    }

    public function test_total_cents_brl_uses_order_amount_when_currency_is_brl(): void
    {
        $user = User::factory()->create();
        $product = $this->createTestProduct();

        $order = Order::create([
            'tenant_id' => 1,
            'user_id' => $user->id,
            'product_id' => $product->id,
            'status' => 'completed',
            'amount' => 97.00,
            'currency' => 'BRL',
            'email' => 'br@example.com',
        ]);

        $this->assertSame(9700, OrderReportingAmounts::totalCentsBrl($order));
    }

    public function test_utmify_payload_uses_settlement_brl_not_usd_charge(): void
    {
        $user = User::factory()->create();
        $product = $this->createTestProduct();

        $order = Order::create([
            'tenant_id' => 1,
            'user_id' => $user->id,
            'product_id' => $product->id,
            'status' => 'completed',
            'amount' => 4.86,
            'currency' => 'USD',
            'email' => 'utmify-intl@example.com',
            'metadata' => [
                'settlement_amount_cents' => 2700,
                'settlement_currency' => 'BRL',
                'checkout_payment_method' => 'google_pay',
            ],
        ]);

        $payload = app(UtmifyService::class)->buildPayload($order, 'paid');

        $this->assertSame(2700, $payload['commission']['totalPriceInCents']);
        $this->assertSame(2700, $payload['products'][0]['priceInCents']);
        $this->assertSame('credit_card', $payload['paymentMethod']);
    }

    public function test_total_cents_brl_converts_foreign_currency_with_tenant_rate_when_no_settlement(): void
    {
        Setting::set('currencies', [
            ['code' => 'BRL', 'rate_to_brl' => 1],
            ['code' => 'USD', 'rate_to_brl' => 0.18],
        ], null, 1);

        $user = User::factory()->create();
        $product = $this->createTestProduct();

        $order = Order::create([
            'tenant_id' => 1,
            'user_id' => $user->id,
            'product_id' => $product->id,
            'status' => 'completed',
            'amount' => 5.00,
            'currency' => 'USD',
            'email' => 'usd-no-settlement@example.com',
        ]);

        // 5 USD / 0.18 = 27.78 BRL → 2778 centavos
        $this->assertSame(2778, OrderReportingAmounts::totalCentsBrl($order));
    }

    /**
     * @return array<string, array{0: string, 1: float, 2: float, 3: int}>
     */
    public static function foreignCurrencyConversionProvider(): array
    {
        return [
            'EUR' => ['EUR', 10.0, 0.16, 6250],   // 10 / 0.16 = 62.50 BRL
            'GBP' => ['GBP', 8.0, 0.14, 5714],    // 8 / 0.14 ≈ 57.14 BRL
            'MZN' => ['MZN', 500.0, 12.5, 4000],  // 500 / 12.5 = 40.00 BRL
            'JPY' => ['JPY', 1500.0, 30.0, 5000], // 1500 / 30 = 50.00 BRL
            'ARS' => ['ARS', 5000.0, 250.0, 2000], // 5000 / 250 = 20.00 BRL
        ];
    }

    /**
     * @dataProvider foreignCurrencyConversionProvider
     */
    public function test_total_cents_brl_converts_any_foreign_currency_to_brl(
        string $currency,
        float $amount,
        float $rateToBrl,
        int $expectedCents
    ): void {
        Setting::set('currencies', [
            ['code' => 'BRL', 'rate_to_brl' => 1],
            ['code' => $currency, 'rate_to_brl' => $rateToBrl],
        ], null, 1);

        $user = User::factory()->create();
        $product = $this->createTestProduct();

        $order = Order::create([
            'tenant_id' => 1,
            'user_id' => $user->id,
            'product_id' => $product->id,
            'status' => 'completed',
            'amount' => $amount,
            'currency' => $currency,
            'email' => strtolower($currency).'@example.com',
        ]);

        $this->assertSame($expectedCents, OrderReportingAmounts::totalCentsBrl($order));
    }

    public function test_total_cents_brl_uses_payment_currency_from_metadata_when_present(): void
    {
        Setting::set('currencies', [
            ['code' => 'BRL', 'rate_to_brl' => 1],
            ['code' => 'EUR', 'rate_to_brl' => 0.16],
        ], null, 1);

        $user = User::factory()->create();
        $product = $this->createTestProduct();

        // Pedido ainda com currency USD no registro, mas webhook gravou payment_currency EUR
        $order = Order::create([
            'tenant_id' => 1,
            'user_id' => $user->id,
            'product_id' => $product->id,
            'status' => 'completed',
            'amount' => 10.0,
            'currency' => 'USD',
            'email' => 'payment-currency@example.com',
            'metadata' => ['payment_currency' => 'EUR'],
        ]);

        $this->assertSame(6250, OrderReportingAmounts::totalCentsBrl($order));
    }

    public function test_utmify_payload_converts_usd_to_brl_without_settlement_metadata(): void
    {
        Setting::set('currencies', [
            ['code' => 'BRL', 'rate_to_brl' => 1],
            ['code' => 'USD', 'rate_to_brl' => 0.18],
        ], null, 1);

        $user = User::factory()->create();
        $product = $this->createTestProduct();

        $order = Order::create([
            'tenant_id' => 1,
            'user_id' => $user->id,
            'product_id' => $product->id,
            'status' => 'completed',
            'amount' => 5.00,
            'currency' => 'USD',
            'email' => 'utmify-usd@example.com',
            'metadata' => ['checkout_payment_method' => 'card'],
        ]);

        $payload = app(UtmifyService::class)->buildPayload($order, 'paid');

        $this->assertSame(2778, $payload['commission']['totalPriceInCents']);
        $this->assertSame(2778, $payload['products'][0]['priceInCents']);
    }

    public function test_total_cents_brl_prefers_amount_brl_metadata_over_tenant_conversion(): void
    {
        Setting::set('currencies', [
            ['code' => 'BRL', 'rate_to_brl' => 1],
            ['code' => 'USD', 'rate_to_brl' => 0.18],
        ], null, 1);

        $user = User::factory()->create();
        $product = $this->createTestProduct();

        $order = Order::create([
            'tenant_id' => 1,
            'user_id' => $user->id,
            'product_id' => $product->id,
            'status' => 'pending',
            'amount' => 5.00,
            'currency' => 'USD',
            'email' => 'amount-brl-meta@example.com',
            'metadata' => ['amount_brl' => 28.50],
        ]);

        $this->assertSame(2850, OrderReportingAmounts::totalCentsBrl($order));
    }
}
