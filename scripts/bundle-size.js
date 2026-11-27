/*
 * Prints what a visitor downloads from the built site (`pnpm build` first), as JSON for the Bundle Size workflow:
 * every page, the stylesheet inlined in them, the JavaScript bundle and the fonts. Text files are measured
 * Brotli-compressed, as Netlify serves them; fonts as they are (WOFF2 is already compressed). Names leave out
 * the fingerprints, so the base and pull request builds line up.
 */
import { readdirSync, readFileSync } from 'fs'
import { dirname, join, relative, resolve } from 'path'
import { fileURLToPath } from 'url'
import { brotliCompressSync, constants } from 'zlib'

const publicDir = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'public')

const brotli = (content) =>
    brotliCompressSync(content, { params: { [constants.BROTLI_PARAM_QUALITY]: constants.BROTLI_MAX_QUALITY } })
        .length

const files = (dir) =>
    readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
        entry.isDirectory() ? files(join(dir, entry.name)) : [join(dir, entry.name)]
    )

try {
    const all = files(publicDir).map((file) => relative(publicDir, file))
    const results = []

    const pages = all.filter((file) => file.endsWith('.html')).sort()
    for (const page of pages) {
        const html = readFileSync(join(publicDir, page))
        results.push({ name: `/${page.replace(/(^|\/)index\.html$/, '$1')} (HTML, br)`, size: brotli(html) })
    }

    // Every page inlines the same stylesheet: measured once, from the homepage
    const css = readFileSync(join(publicDir, 'index.html'), 'utf8').match(/<style>(.*?)<\/style>/s)?.[1]
    if (css) {
        results.push({ name: 'inline CSS (br)', size: brotli(css) })
    }

    for (const file of all.filter((file) => /^build\/.*\.(js|woff2)$/.test(file)).sort()) {
        const content = readFileSync(join(publicDir, file))
        const name = file.replace(/^build\//, '').replace(/\.[0-9a-f]{32}\./, '.')
        results.push(
            file.endsWith('.js') ? { name: `${name} (br)`, size: brotli(content) } : { name, size: content.length }
        )
    }

    console.log(JSON.stringify(results))
} catch {
    console.log('[]')
}
