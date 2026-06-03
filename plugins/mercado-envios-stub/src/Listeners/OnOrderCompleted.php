<?php

namespace Plugins\MercadoEnviosStub\Listeners;

use App\Events\OrderCompleted;
use App\Plugins\PluginOrderContext;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class OnOrderCompleted
{
    public function handle(OrderCompleted $event): void
    {
        if (! Schema::hasTable('mercado_envios_shipments')) {
            return;
        }

        $ctx = PluginOrderContext::fromOrder($event->order);

        DB::table('mercado_envios_shipments')->insert([
            'order_id' => $ctx->orderId,
            'tenant_id' => $ctx->tenantId,
            'tracking_code' => 'STUB-'.strtoupper(substr(uniqid(), -8)),
            'status' => 'label_created',
            'payload' => json_encode(['email' => $ctx->customerEmail]),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
