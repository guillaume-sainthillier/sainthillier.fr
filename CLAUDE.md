# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Guillaume Sainthillier, a freelance web developer based in Toulouse. The site is built with Hugo (static site generator) and uses Vite for JavaScript/CSS bundling with Tailwind CSS v4.

## Build Commands

```bash
# Development
yarn dev              # Build assets in development mode
yarn watch            # Watch mode for asset development
yarn hugo:dev         # Run Hugo dev server with drafts enabled

# Production
yarn build            # Build production assets
yarn build:hugo       # Build assets + Hugo site (used by Netlify)

# Code Quality
yarn lint             # Biome check + fix on assets/
yarn lint-ci          # Biome check, no writes (CI)
yarn prettier         # Prettier write on CSS/MD/YAML
yarn prettier:check   # Prettier check (CI)
yarn format           # yarn lint && yarn prettier
yarn knip             # Check for unused dependencies/exports
yarn skills-cloud     # Regenerate the skills word cloud SVGs (also run by yarn build / yarn dev)
```

## Architecture

### Build Pipeline

- **Vite** (`vite.config.js`) bundles JS/CSS from `assets/` to `static/build/`
- Generates `data/entrypoints.json` for Hugo to consume asset paths
- **Hugo** generates static HTML from `layouts/` and `content/` to `public/`

### Frontend Structure

- **Entry point**: `assets/js/app.modern.js` → imports `app.js` and `icons.js`
- **CSS**: `assets/css/app.css` uses Tailwind CSS v4 with component files in `components/`
- **Custom components**: `SimpleModal.js`, `SimpleCollapse.js` (Bootstrap-like data-bs-\* API without Bootstrap)
- **Third-party**: lite-youtube-embed for videos; images use native `loading="lazy"`
- **Skills word cloud**: packed at build time by `scripts/skills-cloud.js` (`yarn skills-cloud`, part of `yarn build`/`yarn dev`) from the `skills` front matter of `content/_index.md`: words drawn with the Arimo font's glyphs, placed on a collision grid along a spiral (seeded, so stable between builds), written as `assets/generated/skills-cloud-{wide,narrow}.svg` plus `data/skillsCloud.json` (sizes). `homepage.html` shows them in a `<picture>` and keeps the words as a visually hidden list. No JS at runtime

### Hugo Templates

- `layouts/_default/baseof.html` - Base template with asset injection
- `layouts/_default/homepage.html` - Main homepage layout
- `layouts/partials/` - Reusable template partials
- `content/` - Markdown content pages

### Data Flow

Vite build → `static/build/manifest.json` → custom plugin generates `data/entrypoints.json` → Hugo reads entrypoints → injects into HTML templates

## Deployment

Site deploys to Netlify automatically. Build command: `yarn build:hugo`. Publish directory: `public/`.

## Pre-commit Hooks

Husky runs `lint-staged` on commit, which:

- Runs Prettier on CSS/MD files
- Runs Biome with auto-fix on JS/JSON files
