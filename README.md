grunt-saucelabs-junit
=====================

Grunt task that converts saucelabs json report to junit xml report

Usage example: 

Content of 'gruntfile.js'
    
    
    module.exports = function(grunt) {
    
      grunt.initConfig({
          "saucelabs-junit": {
              "target": {
                  "files": {
                      "./": ["saucelabs-*.json"]
                  }
              }
          }
      });
      
      grunt.loadNpmTasks('grunt-saucelabs-junit');
      
      grunt.registerTask('default', ['saucelabs-junit']);
  
}
