'use strict';
var gulp = require('gulp');
var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});
// Put together multiple javascript files.
gulp.task('module:scripts', [], function() {
    return gulp.src([
            // Add your javascript sources' path, ordering to top the source file that contains the module definition.
            // 'src/client/config.js',
            // 'src/client/app/**/*.module.js',
            // 'src/client/app/**/*.js',
            // '!src/client/app/**/*.spec.js'
        ])
        .pipe($.concat('modules.js'))
        .pipe(gulp.dest('.tmp'))
        .pipe($.size());
});
gulp.task('module:partials', [], function() {
    return gulp.src([
            'src/client/app/**/*.html'
        ])
        .pipe($.ngHtml2js({
            moduleName: 'appDoc',
            prefix: '/'
        }))
        .pipe(gulp.dest('.tmp/.module-partials'))
        .pipe($.size());
});
gulp.task('module:scripts:dist', ['module:partials'], function() {
    return gulp.src([
            // Add your javascript sources' path, ordering to top the source file that contains the module definition.
            //'src/client/config.js',
            //'src/client/app/**/*.module.js',
            //'src/client/app/**/*.js',
            //'!src/client/app/**/*.spec.js',
            //'.tmp/.module-partials/**/*.module.js',
            //'.tmp/.module-partials/**/*.js'
        ])
        .pipe($.ngAnnotate())
        .pipe($.concat('modules.js'))
        .pipe(gulp.dest('build_docs'))
        .pipe($.size());
});
// Put together multiple CSS files.
gulp.task('module:styles', [], function() {
    return gulp.src(['']) ///src/client/content/css/styles.css
        .pipe($.concat('modules.css'))
        .pipe(gulp.dest('.tmp'))
        .pipe($.size());
});
gulp.task('module:styles:dist', [], function() {
    return gulp.src(['']) ///src/client/content/css/styles.css
        .pipe($.concat('modules.css'))
        .pipe(gulp.dest('build_docs'))
        .pipe($.size());
});
gulp.task('module', ['module:scripts', 'module:styles']);
gulp.task('module:dist', ['module:scripts:dist', 'module:styles:dist']);
