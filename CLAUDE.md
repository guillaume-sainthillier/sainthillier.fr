# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Guillaume Sainthillier, a freelance web developer based in Toulouse. The site is built with Hugo (static site generator) and uses Vite for JavaScript/CSS bundling with Tailwind CSS v4.

## Build Commands

pnpm is the package manager: its version is pinned by `packageManager` in `package.json`, and `pnpm-workspace.yaml` lists the dependencies allowed to run install scripts (`allowBuilds`; pnpm fails the install on a new unlisted one).

```bash
# Development
pnpm dev              # Build assets in development mode
pnpm watch            # Watch mode for asset development
pnpm hugo:dev         # Run Hugo dev server with drafts enabled

# Production
pnpm build            # Build production assets
pnpm build:hugo       # Build assets + Hugo site (used by Netlify)
pnpm build:hugo:preview  # Same, with drafts and future content

# Code Quality
pnpm lint             # Biome check + fix on assets/
pnpm lint-ci          # Biome check, no writes (CI)
pnpm prettier         # Prettier write on CSS/MD/YAML
pnpm prettier:check   # Prettier check (CI)
pnpm format           # pnpm lint && pnpm prettier
pnpm knip             # Check for unused dependencies/exports
```

## Architecture

### Build Pipeline

- **Vite** (`vite.config.js`) bundles JS/CSS from `assets/` to `static/build/`
- Generates `data/entrypoints.json` for Hugo to consume asset paths
- **Hugo** generates static HTML from `layouts/` and `content/` to `public/`

### Frontend Structure

- **Entry point**: `assets/js/app.js` (navbar scroll spy, contact form, portfolio)
- **CSS**: `assets/css/app.css` uses Tailwind CSS v4; design tokens (colors, fonts, type scale `text-display` / `text-headline-*` / `text-body-*` / `text-label-*`) live in `components/theme.css`, shared blocks (`.container`, `.section`, `.eyebrow`, `.section-title`, `.panel`, `.chip`) in `components/layout.css`, buttons (`btn` + `btn-lg` + `btn-accent` / `btn-soft` / `btn-outline`) in `components/buttons.css`
- **Fonts**: Plus Jakarta Sans (headings) and Inter (text), subset from `@fontsource-variable/*` into `assets/fonts/` by `pnpm fonts:subset` (`scripts/subset-fonts.js`) and declared in `components/fonts.css` with metric-matched fallbacks; labels use the system monospace
- **Icons**: Lucide, inlined at build time with `{{ partial "icon" (dict "name" "mail" "class" "…") }}` (`lucide-static` mounted on `assets/icons` in `config.toml`); no icon JavaScript
- **Custom components**: `SimpleCollapse.js` (mobile menu, Bootstrap-like `data-bs-*` API without Bootstrap), `portfolio.js` (filters + "Afficher tous les projets"; every project stays in the HTML, the script only hides cards)
- **Homepage content**: sections are driven by the front matter of `content/_index.md` (`situations`, `services`, `skill_groups`, `faq`, `contact_needs`, `experiences`, `portfolio_filters`, `projects`); the FAQ also feeds the `FAQPage` JSON-LD in `layouts/partials/schemas.html`
- **Images**: native `loading="lazy"` through the `responsive-image` partial
- **Social preview**: `static/og-image.jpg` is rendered from `scripts/og-image.html` (hero tokens, fonts and portrait) by `pnpm og-image` (headless Chrome); regenerate and commit it after a design change

### Hugo Templates

- `layouts/_default/baseof.html` - Base template with asset injection
- `layouts/_default/homepage.html` - Main homepage layout
- `layouts/partials/` - Reusable template partials
- `content/` - Markdown content pages

### Data Flow

Vite build → custom `generate-entrypoints` plugin (`vite.config.js`) writes `data/entrypoints.json` → Hugo reads entrypoints → injects into HTML templates

## Deployment

Site deploys to Netlify automatically. Build command: `pnpm build:hugo`. Publish directory: `public/`.

## Pre-commit Hooks

Husky runs `lint-staged` on commit, which:

- Runs Biome (`biome check --write`) on JS/JSON files
- Runs Prettier on CSS/MD/YAML files

CI (`.github/workflows/continuous-integration.yml`) runs `pnpm lint-ci`, `pnpm prettier:check` and `pnpm knip`.
