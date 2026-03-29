// eslint-disable-next-line import/no-unresolved
import { defineConfig } from 'vite'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { writeFileSync, mkdirSync } from 'fs'
// eslint-disable-next-line import/no-unresolved
import legacy from '@vitejs/plugin-legacy'
// eslint-disable-next-line import/no-unresolved
import tailwindcss from '@tailwindcss/vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

function generateEntrypoints() {
    const collectedModern = { js: [], css: [] }
    const collectedLegacy = { js: [], css: [] }

    return {
        name: 'generate-entrypoints',
        enforce: 'post',
        generateBundle(_options, bundle) {
            const chunks = Object.values(bundle)

            // Collect modern entries
            const modernEntry = chunks.find(
                (chunk) =>
                    chunk.type === 'chunk' &&
                    chunk.isEntry &&
                    !chunk.fileName.includes('-legacy') &&
                    !chunk.fileName.includes('polyfills')
            )
            if (modernEntry) {
                collectedModern.js = [`/build/${modernEntry.fileName}`]
                collectedModern.css = [...(modernEntry.viteMetadata?.importedCss || [])].map((css) => `/build/${css}`)
            }

            // Collect legacy entries
            const polyfillsEntry = chunks.find(
                (chunk) => chunk.type === 'chunk' && chunk.fileName.includes('polyfills-legacy')
            )
            const legacyEntry = chunks.find(
                (chunk) =>
                    chunk.type === 'chunk' &&
                    chunk.isEntry &&
                    chunk.fileName.includes('-legacy') &&
                    !chunk.fileName.includes('polyfills')
            )
            if (polyfillsEntry) {
                collectedLegacy.js.push(`/build/${polyfillsEntry.fileName}`)
            }
            if (legacyEntry) {
                collectedLegacy.js.push(`/build/${legacyEntry.fileName}`)
            }
        },
        closeBundle() {
            const rootDir = __dirname
            mkdirSync(resolve(rootDir, 'data'), { recursive: true })

            writeFileSync(
                resolve(rootDir, 'data/entrypoints.json'),
                JSON.stringify({ entrypoints: { app: collectedModern } }, null, 2)
            )
            writeFileSync(
                resolve(rootDir, 'data/entrypoints_legacy.json'),
                JSON.stringify({ entrypoints: { app: collectedLegacy } }, null, 2)
            )

            console.log('Generated entrypoints.json and entrypoints_legacy.json')
        },
    }
}

export default defineConfig(({ mode }) => {
    const isProduction = mode === 'production'

    return {
        root: '.',
        base: '/build/',
        publicDir: false,
        build: {
            outDir: 'static/build',
            emptyOutDir: true,
            manifest: true,
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
        server: {
            watch: {
                usePolling: true,
            },
        },
    }
})
