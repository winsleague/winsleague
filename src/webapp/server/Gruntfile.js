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
        specNameSuffix: "spec.js", // also accepts an array
        helperNameSuffix: "helper.js",
        useHelpers: false,
        stopOnFailure: false,
        // configure one or more built-in reporters
        reporters: {
          console: {
            colors: true,
            cleanStack: 1,       // (0|false)|(1|true)|2|3
            verbosity: 3,        // (0|false)|1|2|(3|true)
            listStyle: "indent", // "flat"|"indent"
            activity: false
          },
          // junit: {
          //     savePath: "./reports",
          //     filePrefix: "junit-report",
          //     consolidate: true,
          //     useDotNotation: true
          // },
          // nunit: {
          //     savePath: "./reports",
          //     filename: "nunit-report.xml",
          //     reportName: "Test Results"
          // },
          // terminal: {
          //     color: false,
          //     showStack: false,
          //     verbosity: 2
          // },
          // teamcity: true,
          // tap: true
        },
        // add custom Jasmine reporter(s)
        customReporters: []
      },
      your_target: {
        // target specific options
        options: {
          useHelpers: true
        },
        // spec files
        specs: [
          "test/spec/**",
        ],
        helpers: [
          "test/helpers/**"
        ]
      }
    },

    watch: {
      js: {
        files: [
          'test/**/*.js'
        ],
        tasks: ['jasmine:all']
      }
    }
  });

  grunt.registerTask('test', [
    'babel',
    'jasmine:all'
  ]);
};
