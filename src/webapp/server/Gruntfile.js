'use strict';

module.exports = function(grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    'babel': {
      options: {
        sourceMap: true
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
          'dest': '.babel',
          'ext': '.js'
        }]
      }
    },

    jasmine_nodejs: {
      // task specific (default) options
      options: {
        specNameSuffix: 'spec.js', // also accepts an array
        helperNameSuffix: 'helper.js',
        useHelpers: false,
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
          '.babel/test/spec/**'
        ],
        helpers: [
          '.babel/test/helpers/**'
        ]
      }
    },

    watch: {
      js: {
        files: [
          'test/**/*.js'
        ],
        tasks: ['jasmine_nodejs']
      }
    }
  });

  grunt.registerTask('test', [
    'babel',
    'jasmine_nodejs'
  ]);
};
