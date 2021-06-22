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

const makeConfig = (BROWSERSLIST_ENV) => {
    const DEFAULT_BROWSER_TARGET = 'modern';
    const BROWSER_TARGET = BROWSERSLIST_ENV || DEFAULT_BROWSER_TARGET;
    const COPY_SUFFIX = BROWSER_TARGET === DEFAULT_BROWSER_TARGET ? '' : `_${BROWSER_TARGET}`;

    Encore.reset();
    Encore
        // directory where compiled assets will be stored
        .setOutputPath(`static/build${COPY_SUFFIX}/`)
        // public path used by the web server to access the output path
        .setPublicPath(`/build${COPY_SUFFIX}/`)
        // only needed for CDN's or sub-directory deploy
        .setManifestKeyPrefix(`build${COPY_SUFFIX}/`)

        .copyFiles(
            BROWSER_TARGET === DEFAULT_BROWSER_TARGET
                ? [
                      {
                          from: './assets/images',
                          to: Encore.isProduction()
                              ? 'images/[path][name].[hash:8].[ext]'
                              : 'images/[path][name].[ext]',
                      },
                      {
                          from: './assets/svg',
                          to: Encore.isProduction() ? 'svg/[path][name].[hash:8].[ext]' : 'svg/[path][name].[ext]',
                      },
                      {
                          from: './assets/pdf',
                          to: 'pdf/[path][name].[ext]',
                      },
                  ]
                : []
        )

        /*
         * ENTRY CONFIG
         *
         * Add 1 entry for each "page" of your app
         * (including one that's included on every page - e.g. "app")
         *
         * Each entry will result in one JavaScript file (e.g. app.js)
         * and one CSS file (e.g. app.css) if your JavaScript imports CSS.
         */
        .addEntry(BROWSER_TARGET, './assets/js/app.js')

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

        .configureBabel(() => {}, {
            // node_modules is not processed through Babel by default
            // but you can whitelist specific modules to process
            includeNodeModules: ['bootstrap', 'lazysizes', 'lite-youtube-embed', '@fortawesome'],
        })
        // enables @babel/preset-env polyfills
        .configureBabelPresetEnv((config) => {
            if (BROWSER_TARGET === 'modern') {
                config.modules = 'auto';
                config.targets = { esmodules: true };
            }

            config.browserslistEnv = BROWSER_TARGET;
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
                        path.join(__dirname, 'node_modules/lite-youtube-embed/src/lite-yt-embed.js'),
                    ],
                    { nodir: true }
                ),
                safelist: {
                    standard: [/^weight-(\d+)$/],
                },
            })
        );
    }

    Encore.addPlugin(
        new FileManagerPlugin({
            events: {
                onEnd: {
                    copy: [
                        {
                            source: `./static/build${COPY_SUFFIX}/entrypoints.json`,
                            destination: `./data/entrypoints${COPY_SUFFIX}.json`,
                        },
                        {
                            source: `./static/build${COPY_SUFFIX}/manifest.json`,
                            destination: `./data/manifest${COPY_SUFFIX}.json`,
                        },
                    ],
                },
            },
        }),
        -11
    );

    let config = Encore.getWebpackConfig();
    config.name = BROWSERSLIST_ENV;

    if (BROWSER_TARGET === 'modern') {
        config.output.module = true;
        config.experiments = config.experiments || {};
        config.experiments.outputModule = true;
    } else {
        config.output.environment = config.output.environment || {};
        config.output.environment.arrowFunction = false;
        config.output.environment.const = false;
        config.output.environment.destructuring = false;
        config.output.environment.forOf = false;
    }

    return config;
};

// uncomment if you use TypeScript
//.enableTypeScriptLoader()

// uncomment to get integrity="..." attributes on your script & link tags
// requires WebpackEncoreBundle 1.4 or higher
//.enableIntegrityHashes(Encore.isProduction())

module.exports = Encore.isProduction() ? [makeConfig('modern'), makeConfig('legacy')] : [makeConfig('modern')];
