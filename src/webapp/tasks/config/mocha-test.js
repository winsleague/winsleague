/**
 *
 */
module.exports = function(grunt) {

  grunt.config.set('mochaTest', {
    test: {
      options: {
        reporter: 'spec'
      },
      src: ['tests/bootstrap.test.js', 'tests/**/*.test.js']
    }
  });

  grunt.loadNpmTasks('grunt-mocha-test');
};
