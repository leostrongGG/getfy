<?php

use App\Plugins\PluginExtensionRegistry;
use App\Plugins\PluginRegistry;

return function ($app, $events) {
    PluginExtensionRegistry::register('getfy-plugin-starter', [
        'integration_status_resolver' => function (int $tenantId): bool {
            $cfg = PluginRegistry::getConfig('getfy-plugin-starter', []);

            return ! empty($cfg['enabled']);
        },
    ]);
};
