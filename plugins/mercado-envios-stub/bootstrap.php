<?php

use App\Plugins\PluginExtensionRegistry;
use App\Plugins\PluginRegistry;

spl_autoload_register(function (string $class): void {
    $prefix = 'Plugins\\MercadoEnviosStub\\';
    if (! str_starts_with($class, $prefix)) {
        return;
    }
    $relative = substr($class, strlen($prefix));
    $file = __DIR__.DIRECTORY_SEPARATOR.'src'.DIRECTORY_SEPARATOR.str_replace('\\', DIRECTORY_SEPARATOR, $relative).'.php';
    if (is_file($file)) {
        require_once $file;
    }
});

return function ($app, $events) {
    PluginExtensionRegistry::register('mercado-envios-stub', [
        'integration_status_resolver' => function (int $tenantId): bool {
            $cfg = PluginRegistry::getConfig('mercado-envios-stub', []);

            return ! empty($cfg['api_token']);
        },
    ]);
};
