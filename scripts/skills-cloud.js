/**
 * Builds the homepage skills word cloud as static SVGs, so the page ships no word cloud JavaScript.
 *
 * Words are drawn with the glyph outlines of a bundled font (no dependency on the visitor's fonts), rasterised
 * onto a grid and placed along a spiral from the centre, the first spot where none of their cells is taken wins:
 * the same pixel-accurate packing wordcloud2 did in the browser, done once at build time. A seeded random
 * generator picks the rotations, so the layout is identical on every build, and the largest scale at which
 * every word still fits is searched for each box, so the cloud fills it on desktop as on phones.
 * Each glyph is defined once in the SVG and reused by every word containing it, and SVGO minifies the result.
 *
 * Output: assets/generated/skills-cloud-{wide,narrow}.svg (published by Hugo) and data/skillsCloud.json
 * (their dimensions, for the width/height attributes).
 */
import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import { createRequire } from 'module'
import opentype from 'opentype.js'
import { dirname, resolve } from 'path'
import { optimize } from 'svgo'
import { fileURLToPath } from 'url'
import { parse as parseYaml } from 'yaml'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')

// Box sizes of the former wordcloud2 canvas: container width on desktop / on a phone, 300px high
const LAYOUTS = {
    wide: { width: 1110, height: 300 },
    narrow: { width: 360, height: 300 },
}
const GRID = 4 // collision grid cell, in px
const PADDING = 1 // free cells kept around each word
const GLYPH_UNITS = 100 // font size of the shared glyph definitions
const ROTATE_RATIO = 0.15 // share of rotated words, the two heaviest weights never rotate
const SEED = 5 // change it to get another (stable) arrangement

function readSkills() {
    const markdown = readFileSync(resolve(rootDir, 'content/_index.md'), 'utf-8')
    const frontMatter = markdown.split(/^---$/m)[1]

    return parseYaml(frontMatter).skills
}

function readPrimaryColor() {
    const theme = readFileSync(resolve(rootDir, 'assets/css/components/theme.css'), 'utf-8')

    return theme.match(/--color-primary:\s*(#[0-9a-f]{6})/i)[1]
}

// color-mix(in srgb, primary, gray X%): heavier words are closer to the brand color
function weightColor(primary, weight) {
    const grayShare = (60 - 6 * weight) / 100
    const channels = [1, 3, 5].map((index) => {
        const channel = Number.parseInt(primary.slice(index, index + 2), 16)
        return Math.round(channel * (1 - grayShare) + 128 * grayShare)
    })

    return `#${channels.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`
}

// Relative word size, as the former wordcloud2 weightFactor: weight²
function relativeSize(weight) {
    return weight ** 2
}

// Deterministic PRNG (mulberry32)
function createRandom(seed) {
    let state = seed

    return () => {
        state = (state + 0x6d2b79f5) | 0
        let t = Math.imul(state ^ (state >>> 15), 1 | state)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t

        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

// Word outline centred on (0, 0) as polygons (curves flattened), rotated by `angle`
function outline(font, text, size, angle) {
    const path = font.getPath(text, 0, 0, size)
    const box = path.getBoundingBox()
    const centerX = (box.x1 + box.x2) / 2
    const centerY = (box.y1 + box.y2) / 2
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    const rotate = (x, y) => [(x - centerX) * cos - (y - centerY) * sin, (x - centerX) * sin + (y - centerY) * cos]

    const polygons = []
    let polygon = []
    let [lastX, lastY] = [0, 0]
    for (const command of path.commands) {
        if (command.type === 'M') {
            polygon = [rotate(command.x, command.y)]
            polygons.push(polygon)
        } else if (command.type === 'L') {
            polygon.push(rotate(command.x, command.y))
        } else if (command.type === 'Q' || command.type === 'C') {
            for (let step = 1; step <= 8; step++) {
                const t = step / 8
                const u = 1 - t
                const x =
                    command.type === 'Q'
                        ? u * u * lastX + 2 * u * t * command.x1 + t * t * command.x
                        : u ** 3 * lastX + 3 * u * u * t * command.x1 + 3 * u * t * t * command.x2 + t ** 3 * command.x
                const y =
                    command.type === 'Q'
                        ? u * u * lastY + 2 * u * t * command.y1 + t * t * command.y
                        : u ** 3 * lastY + 3 * u * u * t * command.y1 + 3 * u * t * t * command.y2 + t ** 3 * command.y
                polygon.push(rotate(x, y))
            }
        }
        if (command.x !== undefined) {
            ;[lastX, lastY] = [command.x, command.y]
        }
    }

    return polygons
}

// SVG path data with one decimal. Not Path.toPathData(): its optimiser garbles some glyphs in opentype.js 2
// (the bowl of "a" ends up filled)
function toPathData(commands) {
    const point = (x, y) => `${Math.round(x * 10) / 10} ${Math.round(y * 10) / 10}`

    return commands
        .map((command) => {
            switch (command.type) {
                case 'M':
                case 'L':
                    return `${command.type}${point(command.x, command.y)}`
                case 'Q':
                    return `Q${point(command.x1, command.y1)} ${point(command.x, command.y)}`
                case 'C':
                    return `C${point(command.x1, command.y1)} ${point(command.x2, command.y2)} ${point(command.x, command.y)}`
                default:
                    return 'Z'
            }
        })
        .join('')
}

// Shared glyph definitions (<path id="g…">) and, per word, the glyphs to place, centred like its outline
function glyphUses(font, text, definitions) {
    const box = font.getPath(text, 0, 0, GLYPH_UNITS).getBoundingBox()
    const centerX = (box.x1 + box.x2) / 2
    const centerY = (box.y1 + box.y2) / 2
    const uses = []
    font.forEachGlyph(text, 0, 0, GLYPH_UNITS, {}, (glyph, x) => {
        const pathData = toPathData(glyph.getPath(0, 0, GLYPH_UNITS).commands)
        if (!pathData) return // spaces
        if (!definitions.has(glyph.index)) {
            definitions.set(glyph.index, `<path id="g${glyph.index}" d="${pathData}"/>`)
        }
        uses.push(
            `<use href="#g${glyph.index}" x="${Math.round((x - centerX) * 10) / 10}" y="${Math.round(-centerY * 10) / 10}"/>`
        )
    })

    return uses.join('')
}

// Non-zero winding rule, as fonts are filled
function isInside(polygons, x, y) {
    let winding = 0
    for (const polygon of polygons) {
        for (let index = 0; index < polygon.length; index++) {
            const [x1, y1] = polygon[index]
            const [x2, y2] = polygon[(index + 1) % polygon.length]
            if (y1 <= y && y2 > y && (x2 - x1) * (y - y1) - (x - x1) * (y2 - y1) > 0) winding++
            else if (y1 > y && y2 <= y && (x2 - x1) * (y - y1) - (x - x1) * (y2 - y1) < 0) winding--
        }
    }

    return winding !== 0
}

// Grid cells covered by the word (sampled 2×2 per cell), grown by PADDING, relative to its centre cell
function rasterize(polygons) {
    const points = polygons.flat()
    const minCell = (axis) => Math.floor(Math.min(...points.map((point) => point[axis])) / GRID)
    const maxCell = (axis) => Math.ceil(Math.max(...points.map((point) => point[axis])) / GRID)

    const covered = new Set()
    for (let cellY = minCell(1); cellY <= maxCell(1); cellY++) {
        for (let cellX = minCell(0); cellX <= maxCell(0); cellX++) {
            const hit = [0.25, 0.75].some((dy) =>
                [0.25, 0.75].some((dx) => isInside(polygons, (cellX + dx) * GRID, (cellY + dy) * GRID))
            )
            if (!hit) continue
            for (let padY = -PADDING; padY <= PADDING; padY++) {
                for (let padX = -PADDING; padX <= PADDING; padX++) {
                    covered.add(`${cellX + padX},${cellY + padY}`)
                }
            }
        }
    }

    return [...covered].map((cell) => cell.split(',').map(Number))
}

// Candidate centre cells, from the middle outwards along an elliptic spiral matching the box proportions
function* spiral(columns, rows, random) {
    const ellipticity = Math.min(1, (rows / columns) * 1.5)
    const maxRadius = Math.max(columns / 2, rows / 2 / ellipticity)
    for (let radius = 0; radius <= maxRadius; radius++) {
        const steps = Math.max(1, Math.ceil(2 * Math.PI * radius))
        const offset = random() * 2 * Math.PI
        for (let step = 0; step < steps; step++) {
            const angle = offset + (step / steps) * 2 * Math.PI
            yield [
                Math.round(columns / 2 + radius * Math.cos(angle)),
                Math.round(rows / 2 + radius * Math.sin(angle) * ellipticity),
            ]
        }
    }
}

// Places every word at `scale` × its relative size, or returns null as soon as one does not fit
function layoutCloud(font, skills, { width, height }, scale) {
    const random = createRandom(SEED)
    const columns = Math.floor(width / GRID)
    const rows = Math.floor(height / GRID)
    const taken = new Uint8Array(columns * rows)
    const topWeight = Math.max(...skills.map((skill) => skill.weight))

    const fits = (cells, centerX, centerY) =>
        cells.every(([dx, dy]) => {
            const x = centerX + dx
            const y = centerY + dy
            return x >= 0 && y >= 0 && x < columns && y < rows && !taken[y * columns + x]
        })

    // Heaviest first so they get the middle, equal weights in name order for a stable result
    const ordered = [...skills].sort((a, b) => b.weight - a.weight || a.name.localeCompare(b.name))
    const placed = []
    for (const skill of ordered) {
        const rotated = skill.weight < topWeight - 1 && random() < ROTATE_RATIO
        const angle = rotated ? (random() - 0.5) * Math.PI : 0
        const size = relativeSize(skill.weight) * scale
        const cells = rasterize(outline(font, skill.name, size, angle))

        let spot = null
        for (const candidate of spiral(columns, rows, random)) {
            if (fits(cells, ...candidate)) {
                spot = candidate
                break
            }
        }
        if (!spot) return null

        const [centerX, centerY] = spot
        for (const [dx, dy] of cells) taken[(centerY + dy) * columns + centerX + dx] = 1
        placed.push({ skill, size, angle, x: centerX * GRID, y: centerY * GRID })
    }

    // Big words rarely land symmetrically around the spiral's centre: centre the cloud's actual bounds
    const usedColumns = []
    const usedRows = []
    taken.forEach((cell, index) => {
        if (!cell) return
        usedColumns.push(index % columns)
        usedRows.push(Math.floor(index / columns))
    })
    const shift = (used, total) => Math.round((total - 1 - Math.max(...used) - Math.min(...used)) / 2) * GRID
    const [shiftX, shiftY] = [shift(usedColumns, columns), shift(usedRows, rows)]

    return placed.map((word) => ({ ...word, x: word.x + shiftX, y: word.y + shiftY }))
}

// Largest scale (binary search) at which every word still finds a spot
function fitCloud(font, skills, layout) {
    let [low, high] = [0.05, 2]
    let best = null
    for (let iteration = 0; iteration < 8; iteration++) {
        const scale = (low + high) / 2
        const placed = layoutCloud(font, skills, layout, scale)
        if (placed) [low, best] = [scale, placed]
        else high = scale
    }
    if (!best) throw new Error(`The skills do not fit in the ${layout.width}x${layout.height} cloud`)

    return best
}

function renderSvg(font, placed, primary, { width, height }) {
    const definitions = new Map()
    const words = placed.map(({ skill, size, angle, x, y }) => {
        const uses = glyphUses(font, skill.name, definitions)
        const rotation = angle ? ` rotate(${Math.round((angle * 180) / Math.PI)})` : ''
        const scale = Math.round((size / GLYPH_UNITS) * 1000) / 1000

        return `<g fill="${weightColor(primary, skill.weight)}" transform="translate(${x} ${y})${rotation} scale(${scale})">${uses}</g>`
    })

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><defs>${[...definitions.values()].join('')}</defs>${words.join('')}</svg>\n`
}

const require = createRequire(import.meta.url)
const fontFile = readFileSync(require.resolve('@fontsource/arimo/files/arimo-latin-700-normal.woff'))
const font = opentype.parse(fontFile.buffer.slice(fontFile.byteOffset, fontFile.byteOffset + fontFile.byteLength))
const skills = readSkills()
const primary = readPrimaryColor()

mkdirSync(resolve(rootDir, 'assets/generated'), { recursive: true })
mkdirSync(resolve(rootDir, 'data'), { recursive: true })

const dimensions = {}
for (const [name, layout] of Object.entries(LAYOUTS)) {
    // SVGO rewrites the paths with relative commands and shorter numbers: ~20% less once compressed
    const { data: svg } = optimize(renderSvg(font, fitCloud(font, skills, layout), primary, layout), {
        multipass: true,
    })
    writeFileSync(resolve(rootDir, `assets/generated/skills-cloud-${name}.svg`), svg)
    dimensions[name] = layout
}
writeFileSync(resolve(rootDir, 'data/skillsCloud.json'), `${JSON.stringify(dimensions, null, 2)}\n`)

console.log(`Generated the skills cloud (${skills.length} words)`)
