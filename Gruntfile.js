'use strict';

var getCodeVersion = require('silvermine-serverless-utils/src/get-code-version'),
    versionInfo;

try {
   versionInfo = getCodeVersion.both();
} catch(e) {
   versionInfo = '';
}

module.exports = function(grunt) {

   var config;

   config = {
      html: {
         base: 'src/html',
         all: '<%= config.html.base %>/**/*.html',
         baseTemplate: '<%= config.src.base %>/base-template.html',
      },

      js: {
         all: [ 'Gruntfile.js', 'src/js/**/*.js', 'tests/**/*.js' ],
         allSrc: 'src/js/**/*',
         main: 'src/js/main.js',
         grunt: 'Gruntfile.js',
      },

      src: {
         base: 'src',
      },

      scss: {
         all: [ 'src/scss/**/*.scss', '!**/node_modules/**/*' ],
         main: 'src/scss/index.scss',
      },

      dist: {
         base: 'dist',
         js: {
            base: '<%= config.dist.base %>/js',
            bundle: '<%= config.dist.js.base %>/<%= pkg.name %>.js',
            minified: '<%= config.dist.js.base %>/<%= pkg.name %>.min.js',
         },
         css: {
            base: '<%= config.dist.base %>/css',
            bundle: '<%= config.dist.css.base %>/<%= pkg.name %>.css',
         },
      },
   };

   grunt.initConfig({

      pkg: grunt.file.readJSON('package.json'),

      config: config,

      versionInfo: versionInfo,

      eslint: {
         target: config.js.all,
      },

      clean: {
         build: [ config.dist.base ],
      },

      browserify: {
         main: {
            src: config.js.main,
            dest: config.dist.js.bundle,
            options: {
               transform: [
                  [ 'stringify', { minify: false, appliesTo: { includeExtensions: [ '.html' ] } } ],
               ],
            },
         },
      },

      browserSync: {
         bsFiles: {
            src: [
               'dist/**/*.html',
               'dist/**/*.css',
               'dist/**/*.min.js',
            ],
         },
         options: {
            open: false,
            server: {
               baseDir: [
                  './dist/',
                  './',
               ],
            },
            watchTask: true,
         },
      },

      uglify: {
         main: {
            files: {
               '<%= config.dist.js.minified %>': config.dist.js.bundle,
            },
            options: {
               banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> <%= versionInfo %> */\n',
               sourceMap: true,
               sourceMapIncludeSources: true,
               mangle: true,
               compress: true,
               beautify: false,
            },
         },
      },

      'render-templates': {
         options: {
            baseTemplatePath: config.html.baseTemplate,
            html: {
               base: config.html.base,
               all: config.html.all,
            },
            dist: {
               base: config.dist.base,
            },
         },
      },

      sasslint: {
         options: {
            configFile: 'node_modules/sass-lint-config-silvermine/sass-lint.yml',
         },
         target: config.scss.all,
      },

      sass: {
         main: {
            files: [
               {
                  src: config.scss.main,
                  dest: config.dist.css.bundle,
                  ext: '.css',
                  extDot: 'first',
               },
            ],
         },
         options: {
            sourceMap: true,
            indentWidth: 3,
            outputStyle: 'compressed',
            sourceComments: true,
         },
      },

      postcss: {
         options: {
            map: true,
            processors: [
               require('autoprefixer')({ browsers: '> .05%' }), // eslint-disable-line global-require
            ],
         },
         styles: {
            src: config.dist.css.bundle,
         },
      },

      watch: {
         grunt: {
            files: [ config.js.grunt ],
            tasks: [ 'build' ],
         },

         html: {
            files: [
               config.html.all,
               config.html.baseTemplate,
            ],
            tasks: [ 'build-html' ],
         },

         scss: {
            files: config.scss.all,
            tasks: [ 'build-css' ],
         },

         js: {
            files: config.js.allSrc,
            tasks: [ 'build-js' ],
         },
      },

   });

   grunt.loadTasks('build/tasks');

   grunt.loadNpmTasks('grunt-contrib-clean');
   grunt.loadNpmTasks('grunt-contrib-uglify');
   grunt.loadNpmTasks('grunt-browserify');
   grunt.loadNpmTasks('grunt-contrib-copy');
   grunt.loadNpmTasks('grunt-eslint');
   grunt.loadNpmTasks('grunt-sass');
   grunt.loadNpmTasks('grunt-postcss');
   grunt.loadNpmTasks('grunt-sass-lint');
   grunt.loadNpmTasks('grunt-contrib-watch');
   grunt.loadNpmTasks('grunt-browser-sync');

   grunt.registerTask('standards', [ 'eslint', 'sasslint' ]);
   grunt.registerTask('build-js', [ 'browserify', 'uglify' ]);
   grunt.registerTask('build-css', [ 'sass', 'postcss:styles' ]);
   grunt.registerTask('build-html', [ 'render-templates' ]);
   grunt.registerTask('build', [ 'clean', 'build-js', 'build-css', 'build-html' ]);
   grunt.registerTask('develop', [ 'build', 'browserSync', 'watch' ]);
   grunt.registerTask('default', [ 'standards' ]);
};
