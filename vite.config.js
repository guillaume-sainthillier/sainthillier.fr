import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import legacy from '@vitejs/plugin-legacy';
// eslint-disable-next-line import/no-unresolved
import tailwindcss from '@tailwindcss/vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

function generateEntrypoints() {
    return {
        name: 'generate-entrypoints',
        closeBundle() {
            const rootDir = __dirname;
            mkdirSync(resolve(rootDir, 'data'), { recursive: true });

            const manifestPath = resolve(rootDir, 'static/build/manifest.json');
            const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));

            const modernEntryKey = Object.keys(manifest).find(
                (key) => manifest[key].isEntry && !key.includes('-legacy') && !key.includes('polyfills')
            );
            const modernEntry = manifest[modernEntryKey];

            const entrypoints = {
                entrypoints: {
                    app: {
                        js: [`/build/${modernEntry.file}`],
                        css: (modernEntry.css || []).map((css) => `/build/${css}`),
                    },
                },
            };

            const legacyEntryKey = Object.keys(manifest).find(
                (key) => manifest[key].isEntry && key.includes('-legacy') && !key.includes('polyfills')
            );
            const polyfillsEntryKey = Object.keys(manifest).find((key) => key.includes('polyfills-legacy'));

            const entrypointsLegacy = {
                entrypoints: {
                    app: {
                        js: [],
                        css: [],
                    },
                },
            };

            if (polyfillsEntryKey) {
                entrypointsLegacy.entrypoints.app.js.push(`/build/${manifest[polyfillsEntryKey].file}`);
            }
            if (legacyEntryKey) {
                entrypointsLegacy.entrypoints.app.js.push(`/build/${manifest[legacyEntryKey].file}`);
            }

            writeFileSync(resolve(rootDir, 'data/entrypoints.json'), JSON.stringify(entrypoints, null, 2));
            writeFileSync(resolve(rootDir, 'data/entrypoints_legacy.json'), JSON.stringify(entrypointsLegacy, null, 2));

            console.log('Generated entrypoints.json and entrypoints_legacy.json');
        },
    };
}

export default defineConfig(({ mode }) => {
    const isProduction = mode === 'production';

    return {
        root: '.',
        base: '/build/',
        publicDir: false,
        build: {
            outDir: 'static/build',
            emptyOutDir: true,
            manifest: 'manifest.json',
            rollupOptions: {
                input: {
                    app: resolve(__dirname, 'assets/js/app.modern.js'),
                },
                output: {
                    entryFileNames: isProduction ? '[name].[hash].js' : '[name].js',
                    chunkFileNames: isProduction ? '[name].[hash].js' : '[name].js',
                    assetFileNames: isProduction ? '[name].[hash][extname]' : '[name][extname]',
                },
            },
            sourcemap: !isProduction,
            minify: isProduction ? 'esbuild' : false,
        },
        css: {
            devSourcemap: !isProduction,
        },
        plugins: [
            tailwindcss(),
            legacy({
                targets: ['ie >= 11', 'chrome >= 45', 'firefox >= 38', 'android >= 4.4'],
                additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
                renderLegacyChunks: isProduction,
            }),
            generateEntrypoints(),
        ],
        resolve: {
            alias: {},
        },
        server: {
            watch: {
                usePolling: true,
            },
        },
    };
});
