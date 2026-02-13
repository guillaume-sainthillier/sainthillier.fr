import { readFileSync, statSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const manifestPath = resolve(rootDir, 'static/build/manifest.json');

try {
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));

    const results = Object.entries(manifest).flatMap(([, entry]) => {
        const filePath = resolve(rootDir, 'static/build', entry.file);
        const { size } = statSync(filePath);
        const items = [{ name: entry.file.replace(/\.[a-zA-Z0-9_-]+\./, '.'), size }];

        if (entry.css) {
            entry.css.forEach((cssFile) => {
                const cssPath = resolve(rootDir, 'static/build', cssFile);
                const { size: cssSize } = statSync(cssPath);
                items.push({ name: cssFile.replace(/\.[a-zA-Z0-9_-]+\./, '.'), size: cssSize });
            });
        }

        return items;
    });

    // Deduplicate by name (CSS files may appear in multiple entries)
    const seen = new Set();
    const unique = results.filter((entry) => {
        if (seen.has(entry.name)) return false;
        seen.add(entry.name);
        return true;
    });

    console.log(JSON.stringify(unique));
} catch {
    console.log('[]');
}
