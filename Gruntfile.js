var config = require('./config');

module.exports = function (grunt) {
    grunt.initConfig(config);

    // load npm tasks
    grunt.loadNpmTasks('g-builder/grunt');
    grunt.registerTask('default', ['build']);
};