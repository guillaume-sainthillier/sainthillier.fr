# Guillaume Sainthillier

[![Netlify Status](https://api.netlify.com/api/v1/badges/39c2daaf-f794-4e77-b38f-1aae8df9c012/deploy-status)](https://app.netlify.com/sites/sainthillier/deploys)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Personal portfolio website for Guillaume Sainthillier, a freelance web developer based in Toulouse, France.

**Live site:** [https://sainthillier.fr](https://sainthillier.fr)

Design inspired by [BlackrockDigital agency template](https://github.com/StartBootstrap/startbootstrap-agency).

## Tech Stack

- **[Hugo](https://gohugo.io/)** - Static site generator
- **[Vite](https://vitejs.dev/)** - Modern build tool for JavaScript and CSS bundling
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Font Awesome](https://fontawesome.com/)** - Icon library
- **JavaScript libraries:**
    - [WordCloud](https://github.com/timdream/wordcloud2.js) - Skills visualization
    - [lazysizes](https://github.com/aFarkas/lazysizes) - Lazy loading images
    - [lite-youtube-embed](https://github.com/paulirish/lite-youtube-embed) - Lightweight YouTube embeds

## Features

- 📱 Responsive design optimized for all devices
- ⚡ Fast page loads with static site generation
- 🎨 Modern UI with Tailwind CSS v4
- 🔧 Custom JavaScript components (modals, collapses) with Bootstrap-like API
- 🌐 Legacy browser support (IE11+) via Vite legacy plugin
- 🚀 Automatic deployment to Netlify
- ✨ Pre-commit hooks for code quality (ESLint, Prettier)

## Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [Yarn](https://yarnpkg.com/) package manager
- [Hugo Extended](https://gohugo.io/installation/) (automatically installed via npm)

## Installation

```bash
# Clone the repository
git clone https://github.com/guillaume-sainthillier/sainthillier.fr.git
cd sainthillier.fr

# Install dependencies
yarn install
```

## Development

```bash
# Build assets in development mode
yarn dev

# Watch mode for asset development (auto-rebuild on changes)
yarn watch

# Run Hugo dev server with drafts enabled
yarn hugo:dev

# For full development workflow:
# 1. Run `yarn watch` in one terminal
# 2. Run `yarn hugo:dev` in another terminal
```

The site will be available at `http://localhost:1313/`

## Build

```bash
# Build production assets only
yarn build

# Build assets + Hugo site (production)
yarn build:hugo

# Build with drafts and future posts (preview)
yarn build:hugo:preview
```

The production site will be generated in the `public/` directory.

## Code Quality

```bash
# Run ESLint
yarn lint

# Fix ESLint issues automatically
yarn lint:fix

# Check Prettier formatting
yarn format

# Fix formatting issues
yarn format:fix

# Check for unused dependencies/exports
yarn knip

# Auto-fix unused dependencies/exports
yarn knip:fix
```

Pre-commit hooks automatically run linting and formatting checks on staged files.

## Architecture

### Build Pipeline

1. **Vite** (`vite.config.js`) bundles JavaScript and CSS from `assets/` to `static/build/`
2. Generates `data/entrypoints.json` with asset paths for Hugo
3. **Hugo** generates static HTML from `layouts/` and `content/` to `public/`

### Project Structure

```
.
├── assets/           # Source files for Vite
│   ├── css/         # Tailwind CSS files
│   └── js/          # JavaScript modules
├── content/         # Markdown content pages
├── layouts/         # Hugo templates
│   ├── _default/    # Base templates
│   └── partials/    # Reusable components
├── static/          # Static assets (images, fonts, etc.)
├── public/          # Generated site (build output)
└── data/            # Hugo data files
```

## Deployment

The site is automatically deployed to Netlify on every push to the main branch.

- **Hosting:** Netlify
- **Build command:** `yarn build:hugo`
- **Publish directory:** `public/`

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Guillaume Sainthillier**

- Website: [https://sainthillier.fr](https://sainthillier.fr)
- GitHub: [@guillaume-sainthillier](https://github.com/guillaume-sainthillier)
- LinkedIn: [Développeur Web Toulouse](https://www.linkedin.com/in/developpeur-web-toulouse/)

## Credits

- Original design template by [Start Bootstrap](https://github.com/StartBootstrap/startbootstrap-agency)
- Built with ❤️ in Toulouse, France
