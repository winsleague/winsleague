'use strict';

module.exports = function(grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      tmp: '.tmp'
    },

    babel: {
      options: {
        sourceMap: false
      },
      dist: {
        files: [{
          'expand': true,
          'src': [
            '*.js',
            'models/**/*.js',
            'router/**/*.js',
            'test/**/*.js'
          ],
          'dest': '.tmp',
          'ext': '.js'
        }]
      }
    },

    jasmine_nodejs: {
      // task specific (default) options
      options: {
        specNameSuffix: 'Test.js', // also accepts an array
        helperNameSuffix: 'Helper.js',
        stopOnFailure: false,
        reporters: {
          console: {
            colors: true,
            cleanStack: 1,       // (0|false)|(1|true)|2|3
            verbosity: 3,        // (0|false)|1|2|(3|true)
            listStyle: 'indent', // "flat"|"indent"
            activity: false
          }
        }
      },
      your_target: {
        // target specific options
        options: {
          useHelpers: true
        },
        // spec files
        specs: [
          '.tmp/test/unit/**/*Test.js',
          '.tmp/test/integration/**/*Test.js'
        ],
        helpers: [
          '.tmp/test/helpers/**'
        ]
      }
    },

    watch: {
      js: {
        files: [
          '*.js',
          'models/**/*.js',
          'router/**/*.js',
          'test/**/*.js'
        ],
        tasks: ['test']
      }
    }
  });

  grunt.registerTask('test', [
    'clean:tmp',
    'babel',
    'jasmine_nodejs'
  ]);

  grunt.registerTask('testWatch', [
    'test',
    'watch'
  ]);
};
