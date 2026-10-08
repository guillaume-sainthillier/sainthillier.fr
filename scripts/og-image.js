/*
 * Renders the social preview (static/og-image.jpg, 1200×630) from scripts/og-image.html with headless Chrome.
 * Run `yarn og-image` after changing the template or the design tokens it copies, and commit the result.
 * Chrome is looked up at its macOS location; set CHROME_PATH to use another binary.
 */
import { execFileSync } from 'child_process'
import { statSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const template = resolve(rootDir, 'scripts/og-image.html')
const output = resolve(rootDir, 'static/og-image.jpg')
const chrome = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

execFileSync(
    chrome,
    [
        '--headless',
        '--hide-scrollbars',
        // The template loads the fonts and the portrait from assets/ through file:// URLs
        '--allow-file-access-from-files',
        '--force-device-scale-factor=1',
        '--window-size=1200,630',
        // Leaves time for the web fonts to load before the capture
        '--virtual-time-budget=3000',
        // The extension picks the format: JPEG, like the file already referenced by config.toml
        `--screenshot=${output}`,
        pathToFileURL(template).href,
    ],
    { stdio: 'ignore' }
)

console.log(`static/og-image.jpg: ${(statSync(output).size / 1024).toFixed(1)} KB`)
