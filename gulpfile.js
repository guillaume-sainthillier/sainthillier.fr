var gulp = require('gulp');
var sass = require('gulp-sass');
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var pkg = require('./package.json');
var concat = require("gulp-concat");
var imageResize = require('gulp-image-resize');
var concatCss = require('gulp-concat-css');

// Set the banner content
var banner = ['/*!\n',
    ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)',
    ' * Copyright 2013-' + (new Date()).getFullYear(), ' <%= pkg.author %>',
    ' * Licensed under <%= pkg.license %> (https://github.com/BlackrockDigital/<%= pkg.name %>/blob/master/LICENSE)',
    ' */',
    ''
].join('\n');

// Copy vendor to public path
gulp.task('vendor:group', function () {
    // Bootstrap
    gulp.src([
        './node_modules/bootstrap/dist/**/*',
        '!./node_modules/bootstrap/dist/css/bootstrap-grid*',
        '!./node_modules/bootstrap/dist/css/bootstrap-reboot*'
    ]).pipe(gulp.dest('./public/vendor/bootstrap'));

    // Font Awesome
    gulp.src([
        './node_modules/@fortawesome/**/*',
    ]).pipe(gulp.dest('./public/vendor'));

    // jQuery
    gulp.src([
        './node_modules/jquery/dist/*',
        '!./node_modules/jquery/dist/core.js'
    ]).pipe(gulp.dest('./public/vendor/jquery'));

    // jQuery Easing
    gulp.src([
        './node_modules/jquery.easing/*.js'
    ]).pipe(gulp.dest('./public/vendor/jquery-easing'));

    // jqCloud
    gulp.src([
        './node_modules/jqcloud2/dist/*'
    ]).pipe(gulp.dest('./public/vendor/jqcloud2'));

    //jqBootstrapValidation Custom lib
    gulp.src([
        './assets/vendor/jqBootstrapValidation.js'
    ]).pipe(gulp.dest('./public/vendor/jqBootstrapValidation'));
});


//Concat and minify CSS AND JS
gulp.task('vendor:concat', function () {
    gulp.src([
        'public/vendor/jquery/jquery.js',
        'public/vendor/jquery-easing/jquery.easing.js',
        'public/vendor/bootstrap/js/bootstrap.bundle.js',
        'public/vendor/jqcloud2/jqcloud.js',
        'public/vendor/jqBootstrapValidation/jqBootstrapValidation.js',
    ])
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest("public/vendor"))
        .pipe(rename('bundle.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest("public/vendor"))
        ;

    gulp.src([
        'public/css/bootstrap.css',
        'public/vendor/fontawesome-free/css/all.css',
        'public/vendor/jqcloud2/jqcloud.css',
    ])
        .pipe(concatCss("bundle.css"))
        .pipe(gulp.dest('public/vendor'))
        .pipe(cleanCSS())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('public/vendor'));
});

gulp.task('vendor', ['vendor:group', 'vendor:concat']);

// Compile SCSS to CSS
gulp.task('css:compile', function () {
    return gulp.src('./assets/scss/**/*.scss')
        .pipe(sass.sync({
            includePaths: [
                'node_modules'
            ],
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(header(banner, {
            pkg: pkg
        }))
        .pipe(gulp.dest('./public/css'))
});

// Minify CSS
gulp.task('css:minify', ['css:compile'], function () {
    return gulp.src([
        './public/css/*.css',
        '!./public/css/*.min.css'
    ])
        .pipe(cleanCSS())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./public/css'));
});

gulp.task('css', ['css:compile', 'css:minify']);

// Concat JS
gulp.task('js:concat', function () {
    return gulp.src([
        './assets/js/*.js',
    ])
        .pipe(concat('agency.js'))
        .pipe(gulp.dest("public/js"));
});

// Minify JavaScript
gulp.task('js:minify', function () {
    return gulp.src([
        './public/js/*.js',
        '!./public/js/*.min.js',
    ])
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(header(banner, {
            pkg: pkg
        }))
        .pipe(gulp.dest('./public/js'));
});

gulp.task('js', ['js:concat', 'js:minify']);

gulp.task('img:copy', function () {
    return gulp.src([
        './assets/img/*.*',
    ])
        .pipe(gulp.dest('./public/img'))
});

gulp.task('img:resize', function () {
    //Portfolio resize
    gulp.src('./assets/img/realisations/*.jpg')
        .pipe(imageResize({
            width : 700,
            height: 700 * 4/3,
            imageMagick: true, //PNG to JPG is better here
            noProfile: true
        }))
        .pipe(gulp.dest('./public/img/realisations'));

    gulp.src('./assets/img/realisations/*.jpg')
        .pipe(imageResize({
            width : 1400,
            height: 1400 * 4/3,
            imageMagick: true, //PNG to JPG is better here
            noProfile: true
        }))
        .pipe(rename(function (path) { path.basename += "@2x"; }))
        .pipe(gulp.dest('./public/img/realisations'));

    //Logos resize
    gulp.src('./assets/img/logos/*')
        .pipe(imageResize({
            width : 200,
            height : 200,
            crop : true,
            noProfile: true
        }))
        .pipe(gulp.dest('./public/img/logos'));

    gulp.src('./assets/img/logos/*')
        .pipe(imageResize({
            width : 400,
            height : 400,
            crop : true,
            noProfile: true
        }))
        .pipe(rename(function (path) { path.basename += "@2x"; }))
        .pipe(gulp.dest('./public/img/logos'));

    //Profile resize
    gulp.src('./assets/img/about/*')
        .pipe(imageResize({
            width : 300,
            height : 300,
            crop : true,
            noProfile: true,
            interlace: true
        }))
        .pipe(gulp.dest('./public/img/about'));

    gulp.src('./assets/img/about/*')
        .pipe(imageResize({
            width : 600,
            height : 600,
            crop : true,
            noProfile: true,
            interlace: true
        }))
        .pipe(rename(function (path) { path.basename += "@2x"; }))
        .pipe(gulp.dest('./public/img/about'));

    //Header BG
    gulp.src('./assets/img/header-bg.jpg')
        .pipe(imageResize({
            width : 1900,
            height : 1250,
            quality: 0.5,
            crop : true,
            noProfile: true,
            interlace: true
        }))
        .pipe(gulp.dest('./public/img'));
});
gulp.task('img', ['img:copy', 'img:resize']);


// Default task
gulp.task('default', ['css', 'js', 'img', 'vendor']);

// Dev task
gulp.task('dev', ['css', 'js', 'img'], function () {
    gulp.watch('./assets/scss/*', ['css']);
    gulp.watch('./assets/js/*.js', ['js']);
    gulp.watch('./assets/img/*', ['img']);
});
