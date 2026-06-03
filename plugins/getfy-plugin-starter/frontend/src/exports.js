import SettingsTab from './SettingsTab.vue';
import DashboardPage from './DashboardPage.vue';

const slug = typeof __GETFY_PLUGIN_SLUG__ !== 'undefined' ? __GETFY_PLUGIN_SLUG__ : 'getfy-plugin-starter';

function publish(exportName, component) {
    if (typeof window !== 'undefined' && typeof window.__GETFY_REGISTER_PLUGIN_UI__ === 'function') {
        window.__GETFY_REGISTER_PLUGIN_UI__(slug, exportName, component);
    }
    if (typeof window !== 'undefined') {
        window.__GETFY_PLUGIN_UI__ = window.__GETFY_PLUGIN_UI__ || {};
        window.__GETFY_PLUGIN_UI__[slug] = window.__GETFY_PLUGIN_UI__[slug] || {};
        window.__GETFY_PLUGIN_UI__[slug][exportName] = component;
    }
}

publish('SettingsTab', SettingsTab);
publish('DashboardPage', DashboardPage);

export { SettingsTab, DashboardPage };
