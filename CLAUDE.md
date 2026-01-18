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
yarn lint             # Run ESLint
yarn lint:fix         # Fix ESLint issues
yarn format           # Check Prettier formatting
yarn format:fix       # Fix formatting issues
yarn knip             # Check for unused dependencies/exports
```

## Architecture

### Build Pipeline

- **Vite** (`vite.config.js`) bundles JS/CSS from `assets/` to `static/build/`
- Generates `data/entrypoints.json` for Hugo to consume asset paths
- **Legacy support** via `@vitejs/plugin-legacy` for older browsers (IE11+)
- **Hugo** generates static HTML from `layouts/` and `content/` to `public/`

### Frontend Structure

- **Entry point**: `assets/js/app.modern.js` → imports `app.js` and `icons.js`
- **CSS**: `assets/css/app.css` uses Tailwind CSS v4 with component files in `components/`
- **Custom components**: `SimpleModal.js`, `SimpleCollapse.js` (Bootstrap-like data-bs-\* API without Bootstrap)
- **Third-party**: WordCloud for skills visualization, lazysizes for lazy loading, lite-youtube-embed for videos

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
- Runs ESLint with auto-fix on JS files
