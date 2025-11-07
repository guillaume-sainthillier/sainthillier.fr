import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import purgecss from 'rollup-plugin-purgecss';
import path from 'path';
import { promises as fs } from 'fs';
import { createHash } from 'crypto';

// Build configuration
const isProduction = process.env.NODE_ENV === 'production';
const buildMode = process.env.BUILD_MODE || 'modern';
const isLegacy = buildMode === 'legacy';
const outputSuffix = isLegacy ? '_legacy' : '';

// Asset configuration
const STATIC_ASSETS = [
    { src: 'assets/images', dest: 'images', hash: true },
    { src: 'assets/svg', dest: 'svg', hash: true },
    { src: 'assets/pdf', dest: 'pdf', hash: false },
];

const HASH_PATTERN = /\.[a-f0-9]{8}(\.[^.]+)$/;
const HASH_LENGTH = 8;

// Utility functions
const generateFileHash = (content) => createHash('md5').update(content).digest('hex').substring(0, HASH_LENGTH);

const normalizePathForManifest = (pathStr) => pathStr.replace(/\\/g, '/');

const getHashedFilename = (filename, content) => {
    const hash = generateFileHash(content);
    const ext = path.extname(filename);
    const basename = path.basename(filename, ext);
    return `${basename}.${hash}${ext}`;
};

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

// Static file processing
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
            const outputName = shouldHash && isProduction ? getHashedFilename(entry.name, content) : entry.name;
            const outputDir = path.dirname(relativePath);
            const outputPath =
                outputDir && outputDir !== '.' ? `${destBase}/${outputDir}/${outputName}` : `${destBase}/${outputName}`;

            filesMap.set(`${originalBase}/${relativePath}`, { content, outputPath });
        }
    }
}

// Static files plugin
function staticFilesPlugin() {
    const staticFiles = new Map();

    return {
        name: 'vite-static-files-plugin',
        async buildStart() {
            if (isLegacy) return;

            // eslint-disable-next-line no-restricted-syntax
            for (const { src, dest, hash } of STATIC_ASSETS) {
                const srcPath = path.resolve(__dirname, src);
                try {
                    // eslint-disable-next-line no-await-in-loop
                    await processStaticDir(srcPath, src, dest, hash, staticFiles);
                } catch (err) {
                    console.warn(`Warning: Could not process ${src}:`, err.message);
                }
            }
        },
        async generateBundle() {
            if (isLegacy) return;

            // eslint-disable-next-line no-restricted-syntax
            for (const [, { content, outputPath }] of staticFiles.entries()) {
                this.emitFile({
                    type: 'asset',
                    fileName: outputPath.replace(/^\//, ''),
                    source: content,
                });
            }
        },
    };
}

// Manifest generation
async function addDirToManifest(dirPath, baseDir, manifest, suffix, buildDir) {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    // eslint-disable-next-line no-restricted-syntax
    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
            // eslint-disable-next-line no-await-in-loop
            await addDirToManifest(fullPath, `${baseDir}/${entry.name}`, manifest, suffix, buildDir);
        } else {
            const relativePath = path.relative(buildDir, fullPath);
            const originalName = entry.name.replace(HASH_PATTERN, '$1');
            const pathParts = relativePath.split(path.sep);
            pathParts[pathParts.length - 1] = originalName;
            const originalFullPath = pathParts.join('/');

            manifest[`build/${originalFullPath}`] = `build${suffix}/${normalizePathForManifest(relativePath)}`;
        }
    }
}

async function addStaticFilesToManifest(buildDir, manifest, suffix) {
    // Derive directories from STATIC_ASSETS configuration
    const staticDirs = STATIC_ASSETS.map((asset) => asset.dest);

    // eslint-disable-next-line no-restricted-syntax
    for (const dir of staticDirs) {
        const dirPath = path.join(buildDir, dir);
        try {
            // eslint-disable-next-line no-await-in-loop
            await addDirToManifest(dirPath, dir, manifest, suffix, buildDir);
        } catch {
            // Directory might not exist
        }
    }
}

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

                // Add static files to manifest
                const buildDir = path.resolve(__dirname, `static/build${outputSuffix}`);
                await addStaticFilesToManifest(buildDir, webpackManifest, outputSuffix);

                // Write all manifest files
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
});
