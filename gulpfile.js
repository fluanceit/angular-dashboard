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
