<?php

use App\Plugins\Commerce\PluginCommerceCatalog;
use App\Plugins\PluginTenantContext;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    $tenantId = PluginTenantContext::fromRequest(request());
    $products = [];
    if ($tenantId) {
        $result = PluginCommerceCatalog::listProducts($tenantId, ['limit' => 50], request());
        $products = $result['items'];
    }

    return view('plugin.getfy_vitrine_demo::catalog', [
        'products' => $products,
        'tenant_id' => $tenantId,
    ]);
})->name('catalog');
