var gulp = require('gulp');
var browserify = require('browserify');
var glob = require('glob');
var globWatch = require('glob-watcher');
var gulpWatch = require('gulp-watch');
var source = require('vinyl-source-stream');
var path = require('path');
var watchify = require('watchify');

var browserifyUnit = function (destPath, bOpts, conf, channel, utils) {
    var bundle = function (cbk) {
        utils.log('Task', 'Gallery');
        return bundler.bundle()
            .on('error', function (err) {
                console.log(err.message);
                console.log(err.stack);
            })
            .pipe(source(conf.dest.jsFile))
            .pipe(gulp.dest(destPath));
    };

    var bundler = browserify(bOpts);
    var jsWatcher = watchify(bundler);
    jsWatcher.on('update', function () {
        var stream = bundle();
            channel.emit('RELOAD', 'gallery', destPath + '/*.html');
    });
    bundle();

    return bundler;
};

// html部分
var htmlTaskUnit = function (entryPath, destPath, channel, utils) {
    gulpWatch(entryPath + '/*.html', function () {
        channel.emit('RELOAD', 'gallery', destPath + '/*.html');
    });
};

var taskGallery = function (channel, conf, globalConf, utils) {
    var taskUnit = function (entry) {
        var unitOpt = {
            entries: [entry],
            paths: ['./src'],
            debug: !!globalConf.debug,
            insertGlobals: false,
            detectGlobals: false
        };
        var destPath = entry.replace('/index.js', '');
        htmlTaskUnit(destPath, destPath, channel, utils);
        return browserifyUnit(destPath, unitOpt, conf, channel, utils);
    };

    // 初始
    glob(conf.src.entriesJs, function (err, files) {
        if (err) {
            throw err;
        }
        var tasks = files.map(function (entry) {
            taskUnit(entry);
        });
    });

    // 监听
    var watcher = globWatch([conf.src.entriesJs]);
    var workPath = path.join(process.cwd(), '/');
    // 新增则添加一个task
    watcher.on('add', function (evtData) {
        var entry = evtData.path.replace(workPath, '');
        taskUnit(entry);
    });
};

module.exports = taskGallery;