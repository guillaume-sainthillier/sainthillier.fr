# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Guillaume Sainthillier, a freelance web developer based in Toulouse. The site is built with Hugo (static site generator), which also compiles the Tailwind CSS v4 stylesheet and bundles the JavaScript (Hugo Pipes): there is no separate asset build.

## Build Commands

pnpm is the package manager: its version is pinned by `packageManager` in `package.json`, and `pnpm-workspace.yaml` lists the dependencies allowed to run install scripts (`allowBuilds`; pnpm fails the install on a new unlisted one). It also sets `preferSymlinkedExecutables`: Hugo runs the Tailwind CLI under Node's permission model, which needs `node_modules/.bin/tailwindcss` to be a symlink to the script, not a pnpm shell shim.

Hugo comes from the `hugo-extended` package. Since Hugo 0.170 there is no macOS "extended" release, so its postinstall cannot download Hugo on a Mac (Netlify and the CI run Linux): set `HUGO_BIN_PATH` to a standard Hugo binary of the same version (`brew install hugo`, or the release's `darwin-universal` package) to run the `pnpm` scripts locally.

```bash
# Development
pnpm dev              # Hugo dev server with drafts (CSS and JS rebuilt on change)

# Production
pnpm build            # Build the site to public/ (used by Netlify)
pnpm build:preview    # Same, with drafts and future content
pnpm cgv-pdf          # Print the CGV page to assets/pdf/CGV.pdf (headless Chrome), to commit

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

- **CSS**: `layouts/partials/stylesheet.html` compiles `assets/css/app.css` with `css.TailwindCSS` (the `@tailwindcss/cli` binary, allowed in `[security.exec]` of `config.toml`). It runs through `templates.Defer` in `baseof.html`, after every page is rendered: `hugo_stats.json` (build stats, gitignored) is then current, and its cachebuster in `config.toml` makes `hugo server` recompile the CSS when a template uses a new class. Production inlines the CSS in a `<style>`, development links it
- **Fonts**: `fonts.css` refers to `/fonts/<file>.woff2`; the stylesheet partial publishes each `assets/fonts/*.woff2` fingerprinted under `/build/fonts/` and rewrites the URL (the build fails if a font is never referenced)
- **JS**: `layouts/partials/script.html` bundles `assets/js/app.js` with `js.Build` (esbuild, one ES module, `es2022`) to `/build/app.<hash>.js`. Imports are relative (`./navbar`), no alias
- Everything under `/build/` and `/images/` is fingerprinted and served with an immutable cache (`netlify.toml`)
- **Hugo** generates static HTML from `layouts/` and `content/` to `public/`

### Frontend Structure

- **Entry point**: `assets/js/app.js` (navbar scroll spy, contact form, portfolio)
- **CSS**: `assets/css/app.css` uses Tailwind CSS v4; design tokens (colors, fonts, type scale `text-display` / `text-headline-*` / `text-body-*` / `text-label-*`) live in `components/theme.css`, shared blocks (`.container`, `.section`, `.eyebrow`, `.section-title`, `.panel`, `.chip`) in `components/layout.css`, buttons (`btn` + `btn-lg` + `btn-accent` / `btn-soft` / `btn-outline`) in `components/buttons.css`
- **Fonts**: Plus Jakarta Sans (headings) and Inter (text), subset from `@fontsource-variable/*` into `assets/fonts/` by `pnpm fonts:subset` (`scripts/subset-fonts.js`) and declared in `components/fonts.css` with metric-matched fallbacks; the system monospace is kept for data (technology chips, dates and periods, project status, legal identifiers), labels use Inter
- **Icons**: Lucide, inlined at build time with `{{ partial "icon" (dict "name" "mail" "class" "…") }}` (`lucide-static` mounted on `assets/icons` in `config.toml`); no icon JavaScript
- **Custom components**: `SimpleCollapse.js` (mobile menu, Bootstrap-like `data-bs-*` API without Bootstrap), `portfolio.js` (filters + "Afficher tous les projets"; every project stays in the HTML, the script only hides cards)
- **Homepage content**: sections are driven by the front matter of `content/_index.md` (`situations`, `services`, `skill_groups`, `faq`, `contact_needs`, `experiences`, `portfolio_filters`, `projects`); the FAQ also feeds the `FAQPage` JSON-LD in `layouts/partials/schemas.html`
- **Images**: native `loading="lazy"` through the `responsive-image` partial
- **Social preview**: `static/og-image.jpg` (1200×630) and `.github/social-preview.png` (1280×640, GitHub's safe border of 80px, uploaded by hand in the repository's Settings → Social preview) are rendered from `scripts/og-image.html` (hero tokens, fonts and portrait) by `pnpm og-image` (headless Chrome); regenerate and commit both after a design change
- **Legal pages** (`layout: legal`, `layouts/_default/legal.html`): the publisher and company details come from `[params.publisher]` / `[params.company]` in `config.toml` through the `{{< identity company rcs >}}` shortcode (`layouts/partials/identity.html`; the publisher's address falls back to the company office, so the address is set once); never copy them into the Markdown. The mentions légales open with the card rendering them (`identity: true`)
- **CGV PDF**: `assets/pdf/CGV.pdf` is the CGV page printed by `pnpm cgv-pdf` (`scripts/cgv-pdf.js`: Hugo build in a temporary folder, served on localhost, printed by headless Chrome). The print styles are `print:` utilities in the layouts plus the A4 `@page` rule in `components/base.css`. Regenerate and commit it whenever the CGV or the company details change

### Analytics (Umami)

Self-hosted Umami (`analytics.silarhi.fr`, cookieless) is loaded by `layouts/partials/umami.html` from `[params.umami]` in `config.toml`, from `analytics.sainthillier.fr` (a subdomain that serves only the tracker and its endpoint, so ad blockers do not drop it as a third party), and only reports from `sainthillier.fr`. Conversion events live in `assets/js/analytics.js`: a `track(name, data)` helper calling `window.umami?.track`, and one delegated click listener that classifies links by their href (so links written in Markdown are tracked too). Elements that only exist in templates are marked with our own attributes, the same convention on all the owner's sites: `data-analytics-event="<name>"` plus one `data-analytics-<prop>="<value>"` per property; the same listener reads them and calls `track(name, data)`. Never use Umami's `data-umami-*` attributes: only `analytics.js` knows about `window.umami`, so the markup does not name the analytics tool. Each event is a goal to create in Umami (Reports → Goals, type "Event"):

| Event                | Where it fires                                                                                  | Data                                        |
| -------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------- |
| `contact-form`       | Formspree answered 2xx to the homepage contact form (`initContactForm` in `app.js`)             | `need` (chosen need), `timeline`            |
| `contact-form-error` | the contact form submission failed (network or server error, not a 422 validation error)        | `need`                                      |
| `contact-direct`     | click on any `tel:` / `mailto:` link (listener)                                                 | `channel`: `phone` / `email`                |
| `booking`            | click on a `calendly.com` link (listener)                                                       | none                                        |
| `cv-download`        | click on the CV PDF, `/CV-…pdf` (listener)                                                      | none                                        |
| `cgv-download`       | click on the CGV PDF, `/CGV.pdf` on the CGV page (listener)                                     | none                                        |
| `social-click`       | click on a footer social link (`data-analytics-event`, `baseof.html`)                           | `network`: `linkedin` / `github` / `gitlab` |
| `landing-cta`        | click on the `{{< cta >}}` shortcode button (`developpeur-symfony-freelance-toulouse`, a draft) | `page`: the page path                       |
| `portfolio-filter`   | click on a portfolio filter button (`data-analytics-event`, `homepage.html`)                    | `filter`: the filter id                     |
| `portfolio-show-all` | click on "Afficher tous les projets" (`data-analytics-event`, `homepage.html`)                  | none                                        |

The visitor-facing list of these events and their data is section 4 « Mesure d’audience » of `content/politique-de-confidentialite/index.md`: update it with any new event or property.

### Hugo Templates

- `layouts/_default/baseof.html` - Base template with asset injection
- `layouts/_default/homepage.html` - Main homepage layout
- `layouts/partials/` - Reusable template partials
- `content/` - Markdown content pages

## Deployment

Site deploys to Netlify automatically. Build command: `pnpm build` (Node 26, like the CI). Publish directory: `public/`. The local build plugin `netlify/plugins/hugo-cache` restores and saves `resources/` (Hugo's processed images) through Netlify's build cache, so a deploy only encodes the images that changed.

Security headers (CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`...) are set for `/*` in `netlify.toml`. The CSP only allows the site itself, `analytics.sainthillier.fr` (Umami) and `formspree.io` (contact form): add any new third-party host there (script, image, font, fetch, iframe), or the browser blocks it.

## Pre-commit Hooks

Husky runs `lint-staged` on commit, which:

- Runs Biome (`biome check --write`) on JS/JSON files
- Runs Prettier on CSS/MD/YAML files

CI (`.github/workflows/continuous-integration.yml`) runs `pnpm lint-ci`, `pnpm prettier:check` and `pnpm knip`.
