import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { PurgeCSS } from 'purgecss';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');

async function purgeCss() {
    const buildDir = resolve(rootDir, 'static/build');
    const cssFiles = readdirSync(buildDir).filter((file) => file.endsWith('.css'));

    const purgePromises = cssFiles.map(async (cssFile) => {
        const cssPath = join(buildDir, cssFile);
        const originalSize = readFileSync(cssPath).length;

        const purgeCSSResults = await new PurgeCSS().purge({
            content: [
                join(rootDir, 'content/**/*.md'),
                join(rootDir, 'layouts/**/*.html'),
                join(rootDir, 'assets/js/*.js'),
                join(rootDir, 'node_modules/bootstrap/js/src/**/*.js'),
                join(rootDir, 'node_modules/lazysizes/lazysizes.js'),
                join(rootDir, 'node_modules/lite-youtube-embed/src/lite-yt-embed.js'),
            ],
            css: [cssPath],
            safelist: {
                standard: [/^weight-(\d+)$/],
            },
        });

        if (purgeCSSResults.length > 0) {
            writeFileSync(cssPath, purgeCSSResults[0].css);
            const newSize = purgeCSSResults[0].css.length;
            console.log(
                `Purged CSS: ${cssFile} (${(originalSize / 1024).toFixed(2)} KB -> ${(newSize / 1024).toFixed(2)} KB)`
            );
        }
    });

    await Promise.all(purgePromises);
}

await purgeCss();
