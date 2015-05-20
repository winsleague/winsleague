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
    }
  });

  grunt.registerTask('test', [
    'karma'
  ]);

  grunt.registerTask('default', [
    'karma'
  ]);
};
