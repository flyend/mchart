var browserify = require('browserify');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var gulp = require('gulp');
var gulpWatch = require('gulp-watch');

var bOpts = {
    paths: ['./src'],
    insertGlobals: false,
    detectGlobals: false
};

var taskDemo = function (channel, conf, globalConf, utils) {
    var jsWatcher;
    bOpts.entries = conf.src.entriesJs;
    bOpts.debug = !!globalConf.debug;
    var bundle = function () {
        utils.log('Task', 'Demo');
        return bundler.bundle()
            .on('error', function (err) {
                console.log(err.message);
                console.log(err.stack);
            })
            .pipe(source(conf.dest.jsFile))
            .pipe(gulp.dest(conf.dest.jsPath));
    };

    var bundler = browserify(bOpts);
    jsWatcher = watchify(bundler);
    jsWatcher.on('update', function () {
        var stream = bundle();
        channel.emit('RELOAD', 'demo', conf.reload.target);
    });

    bundle();

    // html部分
    gulpWatch(conf.src.html, function () {
        channel.emit('RELOAD', 'demo', conf.reload.target);
    });
    return bundler;
};

module.exports = taskDemo;