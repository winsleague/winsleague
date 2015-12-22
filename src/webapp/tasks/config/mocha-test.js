/**
 *
 */
module.exports = function(grunt) {

  grunt.config.set('mochaTest', {
    test: {
      options: {
        reporter: 'spec'
      },
      src: ['test/**/*.test.js']
    }
  });

  grunt.loadNpmTasks('grunt-mocha-test');
};
