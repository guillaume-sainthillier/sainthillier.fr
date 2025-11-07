import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import purgecss from 'rollup-plugin-purgecss';
import path from 'path';
import { promises as fs } from 'fs';

// Build configuration
const isProduction = process.env.NODE_ENV === 'production';
const buildMode = process.env.BUILD_MODE || 'modern';
const isLegacy = buildMode === 'legacy';
const outputSuffix = isLegacy ? '_legacy' : '';

// Utility function for writing manifest files
const writeManifestFiles = async (manifest, entrypoints, suffix) => {
    const files = [
        { path: path.resolve(__dirname, `static/build${suffix}/manifest.json`), content: manifest },
        { path: path.resolve(__dirname, `static/build${suffix}/entrypoints.json`), content: entrypoints },
        { path: path.resolve(__dirname, `data/manifest${suffix}.json`), content: manifest },
        { path: path.resolve(__dirname, `data/entrypoints${suffix}.json`), content: entrypoints },
    ];

    await Promise.all(
        files.map(async ({ path: filePath, content }) => {
            await fs.mkdir(path.dirname(filePath), { recursive: true });
            await fs.writeFile(filePath, JSON.stringify(content, null, 2));
        })
    );
};

// Manifest generation plugin
function manifestPlugin() {
    return {
        name: 'vite-manifest-plugin',
        async closeBundle() {
            const manifestPath = path.resolve(__dirname, `static/build${outputSuffix}/.vite/manifest.json`);

            try {
                const viteManifest = JSON.parse(await fs.readFile(manifestPath, 'utf-8'));
                const webpackManifest = {};
                const entrypoints = { entrypoints: { app: { js: [], css: [] } } };

                // Process Vite manifest entries
                // eslint-disable-next-line no-restricted-syntax
                for (const [key, value] of Object.entries(viteManifest)) {
                    if (value.isEntry) {
                        entrypoints.entrypoints.app.js.push(`/build${outputSuffix}/${value.file}`);

                        if (value.css?.length > 0) {
                            value.css.forEach((cssFile) => {
                                entrypoints.entrypoints.app.css.push(`/build${outputSuffix}/${cssFile}`);
                            });
                        }
                    }

                    if (value.file) {
                        // Remove 'assets/' prefix from key
                        const originalPath = key.replace(/^assets\/(js|scss)\//, '').replace(/^assets\//, '');
                        webpackManifest[`build/${originalPath}`] = `build${outputSuffix}/${value.file}`;
                    }
                }

                // Write manifest files
                await writeManifestFiles(webpackManifest, entrypoints, outputSuffix);

                console.log(`✓ Generated manifest${outputSuffix}.json and entrypoints${outputSuffix}.json`);
            } catch (err) {
                console.error('Error generating manifest:', err);
            }
        },
    };
}

// Vite configuration
export default defineConfig({
    build: {
        outDir: `static/build${outputSuffix}`,
        emptyOutDir: true,
        manifest: true,
        rollupOptions: {
            input: {
                app: path.resolve(__dirname, isLegacy ? 'assets/js/app.legacy.js' : 'assets/js/app.modern.js'),
            },
            output: {
                entryFileNames: isProduction ? 'js/[name].[hash].js' : 'js/[name].js',
                chunkFileNames: isProduction ? 'js/[name].[hash].js' : 'js/[name].js',
                assetFileNames: (assetInfo) => {
                    const ext = path.extname(assetInfo.name);
                    const pattern = isProduction ? '[name].[hash][extname]' : '[name][extname]';
                    return ext === '.css' ? `css/${pattern}` : `assets/${pattern}`;
                },
            },
            plugins: isProduction
                ? [
                      purgecss({
                          content: [
                              path.join(__dirname, 'content/**/*.md'),
                              path.join(__dirname, 'layouts/**/*.html'),
                              path.join(__dirname, 'assets/js/*.js'),
                              path.join(__dirname, 'node_modules/bootstrap/js/src/**/*.js'),
                              path.join(__dirname, 'node_modules/lazysizes/lazysizes.js'),
                              path.join(__dirname, 'node_modules/lite-youtube-embed/src/lite-yt-embed.js'),
                          ],
                          safelist: { standard: [/^weight-(\d+)$/] },
                      }),
                  ]
                : [],
        },
        sourcemap: !isProduction,
        minify: isProduction ? 'terser' : false,
        terserOptions: isProduction ? { compress: { drop_console: false } } : undefined,
    },
    resolve: {
        alias: {
            '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
        },
    },
    css: {
        preprocessorOptions: {
            scss: { api: 'modern' },
        },
    },
    plugins: [
        ...(isLegacy
            ? [
                  legacy({
                      targets: ['defaults', 'not IE 11'],
                      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
                      renderLegacyChunks: true,
                      modernPolyfills: false,
                  }),
              ]
            : []),
        manifestPlugin(),
    ],
});
