/* jshint camelcase:false */
var gulp = require('gulp');

var plug = require('gulp-load-plugins')();
var log = plug.util.log;
var env = plug.util.env;
// Our server for dev
var express = require('express');
var app = express();
var browserSync = require('browser-sync');
var server_port = process.env.PORT || 8001;
// Load docs tasks
require('require-dir')('./docs');
// Generate a css file from the scss files
var sass = require('gulp-sass');

/**
 * Generate documentation‡
 */
gulp.task('doc', ['docs:clean'], function() {
    gulp.start('docs:build');
});

/**
 * Generate a css file from the scss files
 */
gulp.task('sass', function () {
  gulp.src('./src/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./src'));
});

/**
 * Run specs once and exit
 * To start servers and run midway specs as well:
 *    gulp test --startServers
 * @return {Stream}
 */
gulp.task('test', function(done) {
    startTests(true /*singleRun*/ , done);
});

/**
 * Start the tests using karma.
 * @param  {boolean} singleRun - True means run once and end (CI), or keep running (dev)
 * @param  {Function} done - Callback to fire when karma is done
 * @return {undefined}
 */
function startTests(singleRun, done) {
    var child;
    var excludeFiles = [];
    var fork = require('child_process').fork;
    var Server = require('karma').Server;

    var server = new Server({
        configFile: __dirname + '/karma.conf.js',
        exclude: excludeFiles,
        singleRun: !!singleRun
    }, karmaCompleted).start();

    function karmaCompleted() {
        if (child) {
            child.kill();
        }
        done();
    }
}

/**
 * serve the dev environment
 */
gulp.task('serve', ['sass'], function() {
    serve({
        mode: 'dev',
        file: 'simple'
    });
});

/**
 * Start the node server using nodemon.
 * Optionally start the node debugging.
 * @param  {Object} args - debugging arguments
 * @return {Stream}
 */
function serve(args) {

    var server = './scripts/';

    var options = {
        script: server + 'app.js',
        delayTime: 1,
        env: {
            'NODE_ENV': args.mode,
            'PORT': server_port
        },
        watch: [server]
    };

    return plug.nodemon(options)
        .on('start', function() {
            startBrowserSync();
            gulp.watch('./src/**/*.scss', ['sass']);
        })
        //.on('change', tasks)
        .on('restart', function() {
            log('restarted!');
            setTimeout(function() {
                browserSync.reload({
                    stream: false
                });
            }, 1000);
        });
}

/**
 * Start BrowserSync
 */
function startBrowserSync() {
    if (!env.sync || browserSync.active) {
        return;
    }

    var filestowatch = [
        './demos/**/*.html',
        './src/**/*.js',
        './src/**/*.css',
        './src/**/*.html',
        './src/**/*.json',
        './src/content/images/**/*.*'
      ];

    log('Starting BrowserSync on port ' + server_port);
    browserSync({
        proxy: 'localhost:' + server_port,
        port: 3000,
        files: filestowatch,
        ghostMode: { // these are the defaults t,f,t,t
            clicks: true,
            location: false,
            forms: true,
            scroll: true
        },
        logLevel: 'debug',
        logPrefix: 'gulp-patterns',
        notify: false,
        reloadDelay: 1000
    });
}
