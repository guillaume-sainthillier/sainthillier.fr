module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-symlink');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Configuration du projet
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        symlink: {
            options: {
                overwrite: false
            },
            expanded: {
                files: [
                    {
                        expand: true,
                        src: ['*'],
                        dest: 'web/prod/img',
                        cwd: 'web/img'
                    },
                    {
                        expand: true,
                        src: ['*'],
                        dest: 'web/prod/fonts',
                        cwd: 'web/bower/font-awesome/fonts'
                    },
                ]
            }
        },
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: [
                    {
                        expand: true,
                        cwd: 'web/prod/css',
                        src: ['*.css', '!*.min.css'],
                        dest: 'web/prod/css',
                        ext: '.min.css'
                    }
                ]
            }
        },
        concat: {
            mainJs: {
                src: [
                    'web/bower/jquery/dist/jquery.js',
                    'web/js/jquery.browser.js',
                    'web/bower/jquery.easing/js/jquery.easing.js',
                    'web/bower/bootstrap/dist/js/bootstrap.js',
                    'web/bower/HCaptions/jquery.hcaptions.js',
                    'web/bower/quicksand/jquery.quicksand.js',
                    'web/js/scripts.js'
                ],
                dest: 'web/prod/js/scripts.js'
            },
            mainCss: {
                src: [
                    'web/bower/bootstrap/dist/css/bootstrap.css',
                    'web/bower/font-awesome/css/font-awesome.css',
                    'web/css/style.css'
                ],
                dest: 'web/prod/css/style.css'
            }
        },
        watch: {
            css: {
                files: ['web/css/*.css'],
                tasks: ['css']
            },
            javascript: {
                files: ['web/js/*.js'],
                tasks: ['javascript']
            }
        },
        uglify: {
            dist: {
                files: {
                    'web/prod/js/scripts.min.js': ['web/prod/js/scripts.js']
                }
            }
        }
    });

    // Default task(s).

    grunt.registerTask('default', ['symlink', 'css', 'javascript']);
    grunt.registerTask('css', ['concat', 'cssmin']);
    grunt.registerTask('javascript', ['concat', 'uglify']);
};