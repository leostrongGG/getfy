<?php

namespace App\PluginSdk;

/**
 * Fachada pública estável para plugins Getfy.
 *
 * Use apenas classes em App\PluginSdk\* — o restante do app/ é interno.
 */
final class Getfy
{
    private static ?PluginConfigService $config = null;

    private static ?PluginTenantService $tenant = null;

    private static ?PluginProductsService $products = null;

    private static ?PluginOrdersService $orders = null;

    private static ?PluginCommerceService $commerce = null;

    private static ?PluginAssetsService $assets = null;

    private static ?PluginHooksService $hooks = null;

    public static function config(): PluginConfigService
    {
        return self::$config ??= new PluginConfigService;
    }

    public static function tenant(): PluginTenantService
    {
        return self::$tenant ??= new PluginTenantService;
    }

    public static function products(): PluginProductsService
    {
        return self::$products ??= new PluginProductsService;
    }

    public static function orders(): PluginOrdersService
    {
        return self::$orders ??= new PluginOrdersService;
    }

    public static function commerce(): PluginCommerceService
    {
        return self::$commerce ??= new PluginCommerceService;
    }

    public static function assets(): PluginAssetsService
    {
        return self::$assets ??= new PluginAssetsService;
    }

    public static function hooks(): PluginHooksService
    {
        return self::$hooks ??= new PluginHooksService;
    }
}
