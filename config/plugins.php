<?php

/**
 * Plugins instalados via ZIP/loja:
 * - GETFY_PLUGINS_USER_PATH definido: usa esse caminho absoluto.
 * - GETFY_DOCKER=true (Compose): `.docker/plugins-installed` — mesmo volume que `getfy_env` (.docker), separado de `storage`.
 * - Caso contrário: `storage/app/plugins-installed`.
 *
 * GETFY_PLUGINS_EXTRA_SCAN: pastas extras só de leitura, separadas por | (opcional).
 */
return [
    'user_install_path' => env('GETFY_PLUGINS_USER_PATH') ?: null,

    'docker_mode' => filter_var(env('GETFY_DOCKER', false), FILTER_VALIDATE_BOOLEAN),

    'extra_scan_paths' => array_values(array_filter(
        array_map('trim', explode('|', (string) env('GETFY_PLUGINS_EXTRA_SCAN', '')))
    )),

    /** Tamanho máximo total de plugins/{slug}/dist/ na validação (bytes). */
    'max_dist_bytes' => (int) env('GETFY_PLUGINS_MAX_DIST_BYTES', 15 * 1024 * 1024),

    /** Carrinho commerce (lojas via plugin). */
    'commerce_cart_ttl_days' => (int) env('GETFY_COMMERCE_CART_TTL_DAYS', 14),
    'commerce_cart_max_lines' => (int) env('GETFY_COMMERCE_CART_MAX_LINES', 50),
    'commerce_checkout_ttl_hours' => (int) env('GETFY_COMMERCE_CHECKOUT_TTL_HOURS', 2),
];
