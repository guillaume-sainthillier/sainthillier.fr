const Encore = require('@symfony/webpack-encore');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const glob = require('glob-all');
const path = require('path');

// Manually configure the runtime environment if not already configured yet by the "encore" command.
// It's useful when you use tools that rely on webpack.config.js file.
if (!Encore.isRuntimeEnvironmentConfigured()) {
    Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev');
}

Encore
    // directory where compiled assets will be stored
    .setOutputPath('static/build')
    // public path used by the web server to access the output path
    .setPublicPath('/build')
    // only needed for CDN's or sub-directory deploy
    .setManifestKeyPrefix('build/')

    .copyFiles([
        {
            from: './assets/images',
            to: Encore.isProduction() ? 'images/[path][name].[hash:8].[ext]' : 'images/[path][name].[ext]',
        },
        {
            from: './assets/svg',
            to: Encore.isProduction() ? 'svg/[path][name].[hash:8].[ext]' : 'svg/[path][name].[ext]',
        },
        {
            from: './assets/pdf',
            to: 'pdf/[path][name].[ext]',
        },
    ])

    /*
     * ENTRY CONFIG
     *
     * Add 1 entry for each "page" of your app
     * (including one that's included on every page - e.g. "app")
     *
     * Each entry will result in one JavaScript file (e.g. app.js)
     * and one CSS file (e.g. app.css) if your JavaScript imports CSS.
     */
    .addEntry('app', './assets/js/app.js')

    // When enabled, Webpack "splits" your files into smaller pieces for greater optimization.
    .splitEntryChunks()

    // will require an extra script tag for runtime.js
    // but, you probably want this, unless you're building a single-page app
    .disableSingleRuntimeChunk()

    /*
     * FEATURE CONFIG
     *
     * Enable & configure other features below. For a full
     * list of features, see:
     * https://symfony.com/doc/current/frontend.html#adding-more-features
     */
    .cleanupOutputBeforeBuild()
    .enableBuildNotifications()
    .enableSourceMaps(!Encore.isProduction())
    // enables hashed filenames (e.g. app.abc123.css)
    .enableVersioning(Encore.isProduction())

    .configureBabel((config) => {}, {
        // node_modules is not processed through Babel by default
        // but you can whitelist specific modules to process
        includeNodeModules: ['bootstrap'],
    })
    // enables @babel/preset-env polyfills
    .configureBabelPresetEnv((config) => {
        config.useBuiltIns = 'usage';
        config.corejs = 3;
    })

    // enables Sass/SCSS support
    .enableSassLoader();

if (Encore.isProduction()) {
    Encore.addPlugin(
        new PurgecssPlugin({
            paths: glob.sync(
                [
                    path.join(__dirname, 'content/**/*.md'),
                    path.join(__dirname, 'layouts/**/*.html'),
                    path.join(__dirname, 'assets/js/*.js'),
                    path.join(__dirname, 'node_modules/bootstrap/js/src/**/*.js'),
                    path.join(__dirname, 'node_modules/lazysizes/lazysizes.js'),
                ],
                { nodir: true }
            ),
            safelist: {
                standard: [/^weight-(\d+)$/, 'lty-playbtn', 'lyt-visually-hidden'],
            },
        })
    );
}

Encore.addPlugin(
    new FileManagerPlugin({
        events: {
            onEnd: {
                copy: [{ source: './static/build/{entrypoints,manifest}.json', destination: './data' }],
            },
        },
    }),
    -11
);

// uncomment if you use TypeScript
//.enableTypeScriptLoader()

// uncomment to get integrity="..." attributes on your script & link tags
// requires WebpackEncoreBundle 1.4 or higher
//.enableIntegrityHashes(Encore.isProduction())

module.exports = Encore.getWebpackConfig();
