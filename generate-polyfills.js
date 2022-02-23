const path = require('path');
const fs = require('fs').promises;
const polyfillLibrary = require('polyfill-library');

(async (polyfills) => {
    const corejsFeatures = await polyfillLibrary.getPolyfills({
        features: {
            Window: {},
            es5: {},
            es6: {},
            es7: {},
        },
    });

    const features = {};
    polyfills.forEach((polyfill) => {
        features[polyfill] = { flags: ['gated'] };
    });

    const content = await polyfillLibrary.getPolyfillString({
        features,
        minify: false,
        excludes: Object.keys(corejsFeatures),
    });

    await fs.writeFile(path.join(__dirname, 'assets/js/polyfills.js'), content);
})(['Element.prototype.append', 'Element.prototype.matches', 'CustomEvent', 'fetch', 'defaults', 'es5', 'es6', 'es7']);
