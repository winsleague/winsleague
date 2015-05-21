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

    jasmine: {
      all: {
        src: [
          'models/**/*.js',
          'router/**/*.js',
          'app.js'
        ],
        options: {
          specs: 'test/spec/**/*.js',
          helpers: 'test/helpers/*',
          vendor: 'node_modules/**/*.js',
          template: require('grunt-template-jasmine-requirejs')
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
    'jasmine:all',
    'watch'
  ]);
};
