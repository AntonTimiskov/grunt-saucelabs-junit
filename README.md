grunt-saucelabs-junit
=====================

Usage example: 

// content of 'gruntfile.js'


module.exports = function(grunt) {

  grunt.initConfig({
      "saucelabs-junit": {
          "t": {
              "files": {
                  "./": ["saucelabs-*.json"]
              }
          }
      }
  });
  
  grunt.loadNpmTasks('grunt-saucelabs-junit');
  
  grunt.registerTask('default', ['saucelabs-junit']);
  
}
