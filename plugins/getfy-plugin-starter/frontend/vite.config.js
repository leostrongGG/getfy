import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { writeFileSync } from 'fs';

const slug = 'getfy-plugin-starter';

export default defineConfig({
    plugins: [
        vue(),
        {
            name: 'ui-manifest',
            closeBundle() {
                const manifest = {
                    version: 1,
                    chunks: { main: 'plugin-ui.js' },
                    exports: ['SettingsTab', 'DashboardPage'],
                };
                writeFileSync(
                    resolve(__dirname, '../dist/ui.manifest.json'),
                    JSON.stringify(manifest, null, 2)
                );
            },
        },
    ],
    build: {
        outDir: resolve(__dirname, '../dist'),
        emptyOutDir: true,
        lib: {
            entry: resolve(__dirname, 'src/exports.js'),
            name: 'GetfyPluginStarterUi',
            formats: ['es'],
            fileName: () => 'plugin-ui.js',
        },
        rollupOptions: {
            output: {
                banner: `const __GETFY_PLUGIN_SLUG__ = '${slug}';`,
            },
        },
    },
});
