/**
 *
 */
module.exports = function(grunt) {

  grunt.config.set('mochaTest', {
    test: {
      options: {
        reporter: 'spec'
      },
      src: ['tests/**/*.test.js']
    }
  });

  grunt.loadNpmTasks('grunt-mocha-test');
};
