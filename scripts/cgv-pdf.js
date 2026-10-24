/*
 * Prints the CGV page to assets/pdf/CGV.pdf (the "pdf" front matter of content/conditions-generales-de-vente/) with
 * headless Chrome, so the PDF is the page itself: same text, shortcodes resolved, same "updated" date.
 * The site is built by Hugo into a temporary folder and served on localhost (the fonts and the stylesheet use
 * root-relative URLs); the print styles (print:hidden in the layouts, @page in base.css) drop the navigation.
 * Run `pnpm cgv-pdf` after changing the CGV or the company details in config.toml, and commit the result.
 * Needs the Vite assets (`pnpm build` or a running `pnpm watch`). Chrome is looked up at its macOS location; set
 * CHROME_PATH to use another binary.
 */
import { execFile, execFileSync } from 'child_process'
import { createReadStream, existsSync, mkdtempSync, rmSync, statSync } from 'fs'
import { createServer } from 'http'
import { tmpdir } from 'os'
import { dirname, extname, join, resolve } from 'path'
import { fileURLToPath } from 'url'
import { promisify } from 'util'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const page = '/conditions-generales-de-vente/'
const output = resolve(rootDir, 'assets/pdf/CGV.pdf')
const chrome = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const contentTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.svg': 'image/svg+xml',
    '.woff2': 'font/woff2',
}

if (!existsSync(resolve(rootDir, 'data/entrypoints.json'))) {
    console.error('Missing data/entrypoints.json: run `pnpm build` first')
    process.exit(1)
}

const siteDir = mkdtempSync(join(tmpdir(), 'cgv-pdf-'))
const server = createServer((request, response) => {
    const path = decodeURIComponent(new URL(request.url, 'http://localhost').pathname)
    const file = join(siteDir, path.endsWith('/') ? `${path}index.html` : path)
    if (!file.startsWith(siteDir) || !existsSync(file) || !statSync(file).isFile()) {
        response.writeHead(404).end()
        return
    }
    response.writeHead(200, { 'Content-Type': contentTypes[extname(file)] || 'application/octet-stream' })
    createReadStream(file).pipe(response)
})

try {
    execFileSync(resolve(rootDir, 'node_modules/.bin/hugo'), ['--minify', '--quiet', '--destination', siteDir], {
        cwd: rootDir,
        stdio: 'inherit',
    })
    await new Promise((done) => server.listen(0, '127.0.0.1', done))

    // Asynchronous: the server above must keep answering Chrome's requests while it prints
    await promisify(execFile)(chrome, [
        '--headless',
        '--no-pdf-header-footer',
        // PDF bookmarks from the headings, one per article
        '--generate-pdf-document-outline',
        // Leaves time for the web fonts to load before printing
        '--virtual-time-budget=5000',
        `--print-to-pdf=${output}`,
        `http://127.0.0.1:${server.address().port}${page}`,
    ])
} finally {
    server.close()
    rmSync(siteDir, { recursive: true, force: true })
}

console.log(`assets/pdf/CGV.pdf: ${(statSync(output).size / 1024).toFixed(1)} KB`)
