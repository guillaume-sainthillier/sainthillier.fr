const Encore = require('@symfony/webpack-encore');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const path = require('path');

// Manually configure the runtime environment if not already configured yet by the "encore" command.
// It's useful when you use tools that rely on webpack.config.js file.
if (!Encore.isRuntimeEnvironmentConfigured()) {
    Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev');
}

const makeConfig = async (BROWSERSLIST_ENV) => {
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
        .addEntry('app', BROWSER_TARGET === 'modern' ? './assets/js/app.modern.js' : './assets/js/app.legacy.js')
        // .splitEntryChunks()
        .disableSingleRuntimeChunk()
        .cleanupOutputBeforeBuild()
        .enableBuildNotifications()
        .enableSourceMaps(!Encore.isProduction())
        .enableVersioning(Encore.isProduction())
        .configureBabel(() => {}, {
            includeNodeModules: ['lazysizes', '@webcomponents/custom-elements', 'lite-youtube-embed'],
        })
        // enables @babel/preset-env polyfills
        .configureBabelPresetEnv((config) => {
            if (BROWSER_TARGET === 'modern') {
                config.modules = 'auto';
                config.bugfixes = true;
                config.targets = { esmodules: true };
            }

            config.browserslistEnv = BROWSER_TARGET;
            config.useBuiltIns = 'usage';
            config.corejs = 3;
        })

        // enables Sass/SCSS support
        .enableSassLoader()

        // enables PostCSS support
        .enablePostCssLoader();

    // Tailwind CSS handles purging via its own configuration
    // PurgeCSS plugin is no longer needed

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

    const config = Encore.getWebpackConfig();
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

module.exports = Encore.isProduction() ? [makeConfig('modern'), makeConfig('legacy')] : makeConfig('modern');
