/*
 * Renders the social previews from scripts/og-image.html with headless Chrome: static/og-image.jpg (1200×630, og:image)
 * and .github/social-preview.png (1280×640, uploaded by hand in the repository's Settings → Social preview).
 * Run `pnpm og-image` after changing the template or the design tokens it copies, and commit both.
 * Chrome is looked up at its macOS location; set CHROME_PATH to use another binary.
 */
import { execFileSync } from 'child_process'
import { statSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const template = pathToFileURL(resolve(rootDir, 'scripts/og-image.html')).href
const chrome = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const images = [
    // JPEG, like the file already referenced by config.toml
    { output: 'static/og-image.jpg', width: 1200, height: 630, hash: '' },
    { output: '.github/social-preview.png', width: 1280, height: 640, hash: '#github' },
]

for (const { output, width, height, hash } of images) {
    execFileSync(
        chrome,
        [
            '--headless',
            '--hide-scrollbars',
            // The template loads the fonts and the portrait from assets/ through file:// URLs
            '--allow-file-access-from-files',
            '--force-device-scale-factor=1',
            `--window-size=${width},${height}`,
            // Leaves time for the web fonts to load before the capture
            '--virtual-time-budget=3000',
            // The extension picks the format
            `--screenshot=${resolve(rootDir, output)}`,
            template + hash,
        ],
        { stdio: 'ignore' }
    )
    console.log(`${output}: ${(statSync(resolve(rootDir, output)).size / 1024).toFixed(1)} KB`)
}
