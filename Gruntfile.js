module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      test: {
        src: [
          '*.js'
        ],
        options: {
          predef: ['exports', 'module', 'Buffer', 'console', '__dirname'],
          curly: true,
          eqeqeq: true,
          immed: true,
          latedef: false,
          newcap: true,
          noarg: true,
          sub: true,
          undef: true,
          boss: true,
          eqnull: true,
          browser: true,
          globals: {
            require: true,
            define: true,
            requirejs: true,
            describe: true,
            expect: true,
            it: true
          }
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
};