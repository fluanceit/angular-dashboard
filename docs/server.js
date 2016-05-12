'use strict';

var gulp = require('gulp');
var util = require('util');

var browserSync = require('browser-sync');

function browserSyncInit(baseDir, files, browser) {
    browser = browser === undefined ? 'default' : browser;

    var routes = null;
    var isDebug = baseDir === '.tmp' || (util.isArray(baseDir) && baseDir.indexOf('.tmp') !== -1);

    if (isDebug) {
        routes = {
            '/bower_components': './bower_components',
            '/dist': './dist',
            '/deps': './bower_components',
        };
    }

    browserSync.instance = browserSync.init(files, {
        startPath: '/index.html',
        server: {
            baseDir: baseDir,
            middleware: [],
            routes: routes
        },
        notify: false,
        browser: browser
    });
}

// Run document application on server for development purposes.
// If you modify ngdoc contents(in .js or .ngdoc), run Dgeni to rebuild partial htmls, and reload.
// If you modify document app, reload only.
gulp.task('docs:serve', ['dgeni', 'docs:wiredep', 'module', 'build'], function() {
    browserSyncInit(['.tmp', 'docs/app'], ['docs/app/*.html', 'docs/app/src/**/*']);
    gulp.watch([
        'docs/config/templates/**/*',
        'docs/app/components/**/*',
        'docs/content/**/*',
        'src/**/*'
        ], ['dgeni',
        browserSync.reload
    ]);
    gulp.watch(['src/**/*.js'], ['module']);
});

// Run document applicaton on server.
gulp.task('docs:serve:dist', ['docs:build'], function() {
    browserSyncInit('build_docs', ['build_docs/**/*.html']);
});
