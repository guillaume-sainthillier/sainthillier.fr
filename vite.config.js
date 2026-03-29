// eslint-disable-next-line import/no-unresolved
import { defineConfig } from 'vite'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { writeFileSync, mkdirSync } from 'fs'
// eslint-disable-next-line import/no-unresolved
import tailwindcss from '@tailwindcss/vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

function generateEntrypoints() {
    const collected = { js: [], css: [] }

    return {
        name: 'generate-entrypoints',
        enforce: 'post',
        generateBundle(_options, bundle) {
            const chunks = Object.values(bundle)

            const entry = chunks.find((chunk) => chunk.type === 'chunk' && chunk.isEntry)
            if (entry) {
                collected.js = [`/build/${entry.fileName}`]
                collected.css = [...(entry.viteMetadata?.importedCss || [])].map((css) => `/build/${css}`)
            }
        },
        closeBundle() {
            const rootDir = __dirname
            mkdirSync(resolve(rootDir, 'data'), { recursive: true })

            writeFileSync(
                resolve(rootDir, 'data/entrypoints.json'),
                JSON.stringify({ entrypoints: { app: collected } }, null, 2)
            )

            console.log('Generated entrypoints.json')
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
            minify: isProduction,
        },
        css: {
            devSourcemap: !isProduction,
        },
        plugins: [tailwindcss(), generateEntrypoints()],
        server: {
            watch: {
                usePolling: true,
            },
        },
    }
})
