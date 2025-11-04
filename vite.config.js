import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import purgecss from 'rollup-plugin-purgecss';
import path from 'path';
import { promises as fs } from 'fs';
import { createHash } from 'crypto';

const isProduction = process.env.NODE_ENV === 'production';
const buildMode = process.env.BUILD_MODE || 'modern';
const isLegacy = buildMode === 'legacy';
const outputSuffix = isLegacy ? '_legacy' : '';

// Helper function to generate hash for file
function generateFileHash(content) {
    return createHash('md5').update(content).digest('hex').substring(0, 8);
}

// Plugin to handle static file copying with hash
function staticFilesPlugin() {
    const staticFiles = new Map();

    return {
        name: 'vite-static-files-plugin',
        async buildStart() {
            if (isLegacy) return; // Only process in modern build

            const assetsToProcess = [
                { src: 'assets/images', dest: 'images', hash: true },
                { src: 'assets/svg', dest: 'svg', hash: true },
                { src: 'assets/pdf', dest: 'pdf', hash: false },
            ];

            // eslint-disable-next-line no-restricted-syntax
            for (const { src, dest, hash: shouldHash } of assetsToProcess) {
                const srcPath = path.resolve(__dirname, src);
                try {
                    // eslint-disable-next-line no-await-in-loop
                    await processStaticDir(srcPath, src, dest, shouldHash, staticFiles);
                } catch (err) {
                    console.warn(`Warning: Could not process ${src}:`, err.message);
                }
            }
        },
        async generateBundle() {
            if (isLegacy) return;

            // Copy static files with hash
            // eslint-disable-next-line no-restricted-syntax
            for (const [, { content, outputPath }] of staticFiles.entries()) {
                const fileName = outputPath.replace(/^\//, '');
                this.emitFile({
                    type: 'asset',
                    fileName,
                    source: content,
                });
            }
        },
    };
}

async function processStaticDir(dirPath, originalBase, destBase, shouldHash, filesMap) {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    // eslint-disable-next-line no-restricted-syntax
    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        const relativePath = fullPath.replace(path.resolve(__dirname, originalBase), '').replace(/^\//, '');

        if (entry.isDirectory()) {
            // eslint-disable-next-line no-await-in-loop
            await processStaticDir(fullPath, originalBase, destBase, shouldHash, filesMap);
        } else {
            // eslint-disable-next-line no-await-in-loop
            const content = await fs.readFile(fullPath);
            let outputName = entry.name;

            if (shouldHash && isProduction) {
                const hash = generateFileHash(content);
                const ext = path.extname(entry.name);
                const basename = path.basename(entry.name, ext);
                outputName = `${basename}.${hash}${ext}`;
            }

            const outputDir = path.dirname(relativePath);
            const outputPath = outputDir ? `${destBase}/${outputDir}/${outputName}` : `${destBase}/${outputName}`;
            const originalKey = `${originalBase}/${relativePath}`;

            filesMap.set(originalKey, {
                content,
                outputPath,
            });
        }
    }
}

// Plugin to generate custom manifest files and copy them to data directory
function manifestPlugin() {
    return {
        name: 'vite-manifest-plugin',
        async closeBundle() {
            const manifestPath = path.resolve(__dirname, `static/build${outputSuffix}/.vite/manifest.json`);
            const outputManifestPath = path.resolve(__dirname, `static/build${outputSuffix}/manifest.json`);
            const dataManifestPath = path.resolve(__dirname, `data/manifest${outputSuffix}.json`);
            const entrypointsPath = path.resolve(__dirname, `static/build${outputSuffix}/entrypoints.json`);
            const dataEntrypointsPath = path.resolve(__dirname, `data/entrypoints${outputSuffix}.json`);

            try {
                // Read Vite's manifest
                const viteManifest = JSON.parse(await fs.readFile(manifestPath, 'utf-8'));

                // Convert Vite manifest to Webpack-style manifest
                const webpackManifest = {};
                const entrypoints = {
                    entrypoints: {
                        app: {
                            js: [],
                            css: [],
                        },
                    },
                };

                // Process each entry in the Vite manifest
                // eslint-disable-next-line no-restricted-syntax
                for (const [key, value] of Object.entries(viteManifest)) {
                    // Handle entry files
                    if (value.isEntry) {
                        const outputPath = `/build${outputSuffix}/${value.file}`;
                        entrypoints.entrypoints.app.js.push(outputPath);

                        // Add CSS files
                        if (value.css && value.css.length > 0) {
                            value.css.forEach((cssFile) => {
                                entrypoints.entrypoints.app.css.push(`/build${outputSuffix}/${cssFile}`);
                            });
                        }
                    }

                    // Map all files for lookup by original path
                    if (value.file) {
                        // For assets imported in JS/CSS
                        const originalPath = key
                            .replace(/^assets\/js\//, '')
                            .replace(/^assets\/scss\//, '')
                            .replace(/^assets\//, '');
                        // Hugo's resources.Get works with paths in static/ directory WITHOUT the static/ prefix
                        webpackManifest[`build/${originalPath}`] = `build${outputSuffix}/${value.file}`;
                    }
                }

                // Add static files to manifest from the output directory
                const buildDir = path.resolve(__dirname, `static/build${outputSuffix}`);
                await addStaticFilesToManifest(buildDir, webpackManifest, outputSuffix);

                // Write manifests
                await fs.mkdir(path.dirname(outputManifestPath), { recursive: true });
                await fs.writeFile(outputManifestPath, JSON.stringify(webpackManifest, null, 2));
                await fs.writeFile(entrypointsPath, JSON.stringify(entrypoints, null, 2));

                // Copy to data directory
                await fs.mkdir(path.dirname(dataManifestPath), { recursive: true });
                await fs.writeFile(dataManifestPath, JSON.stringify(webpackManifest, null, 2));
                await fs.writeFile(dataEntrypointsPath, JSON.stringify(entrypoints, null, 2));

                console.log(`✓ Generated manifest${outputSuffix}.json and entrypoints${outputSuffix}.json`);
            } catch (err) {
                console.error('Error generating manifest:', err);
            }
        },
    };
}

async function addStaticFilesToManifest(buildDir, manifest, suffix) {
    const staticDirs = ['images', 'svg', 'pdf'];

    // eslint-disable-next-line no-restricted-syntax
    for (const dir of staticDirs) {
        const dirPath = path.join(buildDir, dir);
        try {
            // eslint-disable-next-line no-await-in-loop
            await addDirToManifest(dirPath, dir, manifest, suffix);
        } catch {
            // Directory might not exist
        }
    }
}

async function addDirToManifest(dirPath, baseDir, manifest, suffix) {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    // eslint-disable-next-line no-restricted-syntax
    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
            // eslint-disable-next-line no-await-in-loop
            await addDirToManifest(fullPath, `${baseDir}/${entry.name}`, manifest, suffix);
        } else {
            const relativePath = fullPath.split(`/build${suffix}/`)[1];
            const originalName = entry.name.replace(/\.[a-f0-9]{8}(\.[^.]+)$/, '$1');

            // Reconstruct the original path
            const pathParts = relativePath.split('/');
            pathParts[pathParts.length - 1] = originalName;
            const originalFullPath = pathParts.join('/');

            // Hugo's resources.Get works with paths in static/ directory WITHOUT the static/ prefix
            manifest[`build/${originalFullPath}`] = `build${suffix}/${relativePath}`;
        }
    }
}

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
                    if (ext === '.css') {
                        return isProduction ? `css/[name].[hash][extname]` : `css/[name][extname]`;
                    }
                    // Images and other assets
                    return isProduction ? `assets/[name].[hash][extname]` : `assets/[name][extname]`;
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
                          safelist: {
                              standard: [/^weight-(\d+)$/],
                          },
                      }),
                  ]
                : [],
        },
        sourcemap: !isProduction,
        minify: isProduction ? 'terser' : false,
        terserOptions: isProduction
            ? {
                  compress: {
                      drop_console: false,
                  },
              }
            : undefined,
    },
    resolve: {
        alias: {
            '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern',
            },
        },
    },
    plugins: [
        ...(isLegacy ? [] : [staticFilesPlugin()]),
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
    server: {
        port: 3000,
        strictPort: false,
    },
});
