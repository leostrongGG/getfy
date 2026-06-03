import { registerGatewayMethod } from '@/components/checkout/gateways/registry';
import { buildPluginUiIndex, ensurePluginUiLoaded } from '@/plugins/pluginUiLoader';

/**
 * Registra componentes de checkout exportados por plugins (frontend.exports.checkout).
 *
 * @param {Record<string, unknown>} pluginUiPayload
 * @param {Array<{ gateway_slug?: string, id?: string }>} paymentMethods
 */
export async function registerPluginCheckoutComponents(pluginUiPayload, paymentMethods = []) {
    const bySlug = buildPluginUiIndex(pluginUiPayload);
    const methods = Array.isArray(paymentMethods) ? paymentMethods : [];

    for (const meta of Object.values(bySlug)) {
        const checkoutMap = meta?.frontend_exports_map?.checkout;
        if (!checkoutMap || typeof checkoutMap !== 'object' || !meta.entry) {
            continue;
        }

        const slugsUsed = new Set(
            methods
                .map((m) => (m?.gateway_slug || '').toLowerCase())
                .filter(Boolean),
        );

        for (const [methodId, exportName] of Object.entries(checkoutMap)) {
            if (!exportName || typeof exportName !== 'string') {
                continue;
            }
            let gatewaySlug = meta.slug;
            for (const s of slugsUsed) {
                if (s.includes(meta.slug) || meta.slug.includes(s)) {
                    gatewaySlug = s;
                    break;
                }
            }
            try {
                await ensurePluginUiLoaded(meta, exportName);
                const component = window.__GETFY_PLUGIN_UI__?.[meta.slug]?.[exportName];
                if (component) {
                    registerGatewayMethod(gatewaySlug, methodId, component);
                }
            } catch (_) {
                // Plugin checkout UI opcional; falha não bloqueia checkout.
            }
        }
    }
}

if (typeof window !== 'undefined') {
    window.__GETFY_CHECKOUT_REGISTER__ = registerGatewayMethod;
}
