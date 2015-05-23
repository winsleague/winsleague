'use strict';

module.exports = function(grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    karma: {
      unit: {
        configFile: 'test/karma.conf.js'
      }
    },

    "babel": {
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
            'test/**/*.js',
          ],
          'dest': '.babel',
          'ext': '.js'
        }]
      }
    },

    jasmine: {
      all: {
        src: [
          '.babel/models/**/*.js',
          '.babel/router/**/*.js',
          '.babel/*.js'
        ],
        options: {
          specs: '.babel/test/spec/**/*.js',
          helpers: '.babel/test/helpers/*',
          vendor: 'node_modules/**/*.js',
          template: require('grunt-template-jasmine-requirejs'),
          templateOptions: {
            requireConfig: {
              baseUrl: ''
            }
          }
        }
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
