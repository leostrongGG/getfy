<?php

use App\PluginSdk\Getfy;
use App\Plugins\PluginExtensionRegistry;
use App\Plugins\PluginRegistry;

return function ($app, $events) {
    PluginExtensionRegistry::register('getfy-plugin-starter', [
        'integration_status_resolver' => function (int $tenantId): bool {
            $cfg = Getfy::config()->get('getfy-plugin-starter', []);

            return ! empty($cfg['enabled']);
        },
    ]);

    Getfy::hooks()->addFilter('panel.menu', function (array $items) {
        return $items;
    }, 20);
};
