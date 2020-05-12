const { series, parallel, src, dest, watch } = require('gulp');
const sass = require('gulp-sass');
const header = require('gulp-header');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const autoprefixer = require('gulp-autoprefixer');
const pkg = require('./package.json');
const concat = require('gulp-concat');
const imageResize = require('gulp-image-resize');
const concatCss = require('gulp-concat-css');
const plumber = require('gulp-plumber');
const image = require('gulp-image');
const newer = require('gulp-newer');
const purgecss = require('gulp-purgecss');
const merge = require('merge-stream');

// Set the banner content
const banner = [
    '/*!',
    ' * <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)',
    ' * Copyright 2013 - ' + new Date().getFullYear(),
    ' * Licensed under <%= pkg.license %> (https://github.com/guillaume-sainthillier/<%= pkg.name %>/blob/master/LICENSE)',
    ' */',
    '',
].join('\n');

// Copy vendor to public path
function vendorGroup() {
    // Bootstrap
    var bootstrap = src([
        './node_modules/bootstrap/dist/**/*',
        '!./node_modules/bootstrap/dist/css/bootstrap-grid*',
        '!./node_modules/bootstrap/dist/css/bootstrap-reboot*',
    ]).pipe(dest('./public/vendor/bootstrap'));

    // Font Awesome
    var fa = src(['./node_modules/@fortawesome/fontawesome-free/css/*']).pipe(
        dest('./public/vendor/fontawesome-free/')
    );

    var faFonts = src(['./node_modules/@fortawesome/fontawesome-free/webfonts/*']).pipe(dest('./public/webfonts'));

    // jQuery
    var jquery = src(['./node_modules/jquery/dist/*', '!./node_modules/jquery/dist/core.js']).pipe(
        dest('./public/vendor/jquery')
    );

    // jQuery Easing
    var jqueryEasing = src(['./node_modules/jquery.easing/*.js']).pipe(dest('./public/vendor/jquery-easing'));

    // jqCloud
    var jqCloud = src(['./node_modules/jqcloud2/dist/*']).pipe(dest('./public/vendor/jqcloud2'));

    //jqBootstrapValidation Custom lib
    var jqBootstrapValidation = src(['./assets/vendor/jqBootstrapValidation.js']).pipe(
        dest('./public/vendor/jqBootstrapValidation')
    );

    return merge(bootstrap, fa, faFonts, jquery, jqueryEasing, jqCloud, jqBootstrapValidation);
}

//Concat and minify CSS AND JS
function vendorConcat() {
    var js = src([
        './public/vendor/jquery/jquery.js',
        './public/vendor/jquery-easing/jquery.easing.js',
        './public/vendor/bootstrap/js/bootstrap.bundle.js',
        './public/vendor/jqcloud2/jqcloud.js',
        './public/vendor/jqBootstrapValidation/jqBootstrapValidation.js',
    ])
        .pipe(concat('bundle.js'))
        .pipe(dest('public/vendor'))
        .pipe(rename('bundle.min.js'))
        .pipe(uglify())
        .pipe(dest('public/vendor'));
    var css = src(['./public/vendor/fontawesome-free/all.css', './public/vendor/jqcloud2/jqcloud.css'])
        .pipe(concatCss('bundle.css'))
        .pipe(dest('./public/vendor'))
        .pipe(cleanCSS())
        .pipe(
            rename({
                suffix: '.min',
            })
        )
        .pipe(dest('./public/vendor'));

    return merge(css, js);
}

// Compile SCSS to CSS
function cssCompile() {
    return src('./assets/scss/**/*.scss')
        .pipe(plumber())
        .pipe(
            sass({
                outputStyle: 'expanded',
                includePaths: './node_modules',
            })
        )
        .on('error', sass.logError)
        .pipe(
            autoprefixer({
                cascade: false,
            })
        )
        .pipe(
            header(banner, {
                pkg: pkg,
            })
        )
        .pipe(
            purgecss({
                content: [
                    './templates/*.html.twig',
                    'required/*.php',
                    './assets/js/*.js',
                    './node_modules/jqcloud2/dist/*.js',
                ],
                whitelist: [
                    'show',
                    'hide',
                    'showing',
                    'fade',
                    'active',
                    'focus',
                    'disabled',
                    'btn',
                    'collapse',
                    'collapsing',
                    'collapsed',
                    'dropdown-menu',
                    'dropdown-menu-right',
                    'dropdown-menu-left',
                    'position-static',
                    'dropleft',
                    'dropright',
                    'dropup',
                    'dropdown-item',
                    'dropdown-menu',
                    'modal-open',
                    'modal-backdrop',
                    'modal-scrollbar-measure',
                    'modal-dialog-scrollable',
                ],
                whitelistPatterns: [/^w(\d+)$/],
            })
        )
        .pipe(dest('./public/css'));
}

// Minify CSS
function cssMinify() {
    return src(['./public/css/bootstrap.css', './public/css/agency.css'])
        .pipe(concatCss('agency.min.css'))
        .pipe(cleanCSS())
        .pipe(dest('./public/css'));
}

// Concat JS
function jsConcat() {
    return src(['./assets/js/*.js']).pipe(concat('agency.js')).pipe(dest('./public/js'));
}

// Minify JavaScript
function jsMinify() {
    return src(['./public/js/*.js', '!./public/js/*.min.js'])
        .pipe(uglify())
        .pipe(
            rename({
                suffix: '.min',
            })
        )
        .pipe(
            header(banner, {
                pkg: pkg,
            })
        )
        .pipe(dest('./public/js'));
}

function jsImage() {
    //Portfolio resize
    var realisations = src('./assets/img/realisations/*.jpg')
        .pipe(newer('./public/img/realisations'))
        .pipe(
            imageResize({
                width: 700,
                height: (700 * 4) / 3,
                imageMagick: true, //PNG to JPG is better here
                noProfile: true,
            })
        )
        .pipe(image())
        .pipe(dest('./public/img/realisations'));

    var realisationsRetina = src('./assets/img/realisations/*.jpg')
        .pipe(newer('./public/img/realisations'))
        .pipe(
            imageResize({
                width: 1400,
                height: (1400 * 4) / 3,
                imageMagick: true, //PNG to JPG is better here
                noProfile: true,
            })
        )
        .pipe(image())
        .pipe(
            rename(function (path) {
                path.basename += '@2x';
            })
        )
        .pipe(dest('./public/img/realisations'));

    //Logos resize
    var logos = src('./assets/img/logos/*.jpg')
        .pipe(newer('./public/img/logos'))
        .pipe(
            imageResize({
                width: 200,
                height: 200,
                crop: true,
                noProfile: true,
            })
        )
        .pipe(image())
        .pipe(dest('./public/img/logos'));

    var logosRetina = src('./assets/img/logos/*.jpg')
        .pipe(newer('./public/img/logos'))
        .pipe(
            imageResize({
                width: 400,
                height: 400,
                crop: true,
                noProfile: true,
            })
        )
        .pipe(image())
        .pipe(
            rename(function (path) {
                path.basename += '@2x';
            })
        )
        .pipe(dest('./public/img/logos'));

    //Profile resize
    var about = src('./assets/img/about/*.jpg')
        .pipe(newer('./public/img/about'))
        .pipe(
            imageResize({
                width: 300,
                height: 300,
                crop: true,
                noProfile: true,
                interlace: true,
            })
        )
        .pipe(image())
        .pipe(dest('./public/img/about'));

    var aboutRetina = src('./assets/img/about/*.jpg')
        .pipe(newer('./public/img/about'))
        .pipe(
            imageResize({
                width: 600,
                height: 600,
                crop: true,
                noProfile: true,
                interlace: true,
            })
        )
        .pipe(image())
        .pipe(
            rename(function (path) {
                path.basename += '@2x';
            })
        )
        .pipe(dest('./public/img/about'));

    //Header BG
    var header = src('./assets/img/header-bg.jpg')
        .pipe(newer('./public/img'))
        .pipe(
            imageResize({
                width: 1900,
                height: 1250,
                quality: 0.5,
                crop: true,
                noProfile: true,
                interlace: true,
            })
        )
        .pipe(image())
        .pipe(dest('./public/img'));

    return merge(realisations, realisationsRetina, logos, logosRetina, about, aboutRetina, header);
}

// Dev task
function watchFiles() {
    watch('./assets/scss/*', css);
    watch('./assets/js/*.js', js);
    watch('./assets/img/*', img);
}

// Define complex tasks
const css = series(cssCompile, cssMinify);
const js = series(jsConcat, jsMinify);
const img = series(jsImage);

const vendor = series(vendorGroup, vendorConcat);
const build = series(vendor, parallel(css, js, img));
const dev = series(parallel(css, js, img), watchFiles);

exports.vendor = vendor;
exports.css = css;
exports.js = js;
exports.img = img;
exports.build = build;
exports.dev = dev;
exports.default = build;
