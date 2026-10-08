/*
 * Generates the self-hosted web fonts (assets/fonts/*.woff2) from the @fontsource-variable packages, keeping
 * only what the site renders: French text and common punctuation, and the font weights in use. That takes the
 * Latin files from 74 KB to about 30 KB. Run `yarn fonts:subset` after updating a font package or using a new
 * weight, and commit the result; the ranges below must match the @font-face rules in assets/css/components/fonts.css.
 */
import { mkdirSync, readFileSync, statSync, writeFileSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import subsetFont from 'subset-font'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = resolve(rootDir, 'assets/fonts')

// Same as UNICODE_RANGE in fonts.css: Basic Latin, Latin-1, œ Œ Ÿ, general punctuation (’ « » – … •), € ™ −
const UNICODE_RANGES = [
    [0x20, 0x7e],
    [0xa0, 0xff],
    [0x131, 0x131],
    [0x152, 0x153],
    [0x178, 0x178],
    [0x2c6, 0x2c6],
    [0x2da, 0x2da],
    [0x2dc, 0x2dc],
    [0x2000, 0x206f],
    [0x20ac, 0x20ac],
    [0x2122, 0x2122],
    [0x2212, 0x2212],
]

// OpenType features browsers apply by default (rvrn: variable-font glyph swaps); stylistic sets, tabular figures,
// fractions... are dropped, the site uses no font-feature-settings
const KEEP_FEATURES = ['ccmp', 'locl', 'rvrn', 'kern', 'liga', 'clig', 'calt', 'mark', 'mkmk']

const FONTS = [
    {
        source: '@fontsource-variable/inter/files/inter-latin-wght-normal.woff2',
        output: 'inter-latin-wght.woff2',
        weight: { min: 400, max: 700 },
    },
    {
        source: '@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin-wght-normal.woff2',
        output: 'plus-jakarta-sans-latin-wght.woff2',
        weight: { min: 600, max: 800 },
    },
]

const text = UNICODE_RANGES.flatMap(([from, to]) =>
    Array.from({ length: to - from + 1 }, (_, i) => String.fromCodePoint(from + i))
).join('')

mkdirSync(outDir, { recursive: true })

for (const { source, output, weight } of FONTS) {
    const sourcePath = resolve(rootDir, 'node_modules', source)
    const subset = await subsetFont(readFileSync(sourcePath), text, {
        targetFormat: 'woff2',
        keepFeatures: KEEP_FEATURES,
        // The default instance must sit inside the kept range
        variationAxes: { wght: { ...weight, default: weight.min } },
    })
    writeFileSync(resolve(outDir, output), subset)

    const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`
    console.log(`${output}: ${kb(statSync(sourcePath).size)} → ${kb(subset.length)} (wght ${weight.min}–${weight.max})`)
}
