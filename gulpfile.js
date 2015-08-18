/* jshint camelcase:false */
var gulp = require('gulp');

var plug = require('gulp-load-plugins')();

// Load docs tasks
require('require-dir')('./docs');

/**
 * Generate documentation‡
 */
gulp.task('doc', ['docs:clean'], function() {
    gulp.start('docs:build');
});
