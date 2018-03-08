var gulp = require('gulp');
var gulpWatch = require('gulp-watch');
var browserify = require('browserify');
var glob = require('glob');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var path = require('path');
var unitList = require('../mchart-unit-conf.json') || [];

var browserifyUnit = function (destPath, destFile, bOpts, conf, channel, utils, taskInfo) {
    var bundle = function () {
        utils.log('Task', 'Mchart Unit');
        return bundler.bundle()
            .on('error', function (err) {
                console.log(err.message);
                console.log(err.stack);
            })
            .pipe(source(destFile))
            .pipe(gulp.dest(destPath));
    };

    var bundler = browserify(bOpts);
    var jsWatcher = watchify(bundler);
    var reloadTarget;
    if (taskInfo && taskInfo.active && taskInfo.active.length) {
        reloadTarget = taskInfo.active.map(function (activeItem) {
            return 'src/' + activeItem + '/index.html'
        });
    }
    else {
        reloadTarget = conf.reload.target;
    }
    jsWatcher.on('update', function () {
        var stream = bundle();
        stream.on('end', function () {
            channel.emit('RELOAD', 'mchartunit', reloadTarget);
        });
    });
    bundle();
    return bundler;
};

var taskMchartUnit = function (channel, conf, globalConf, utils, taskInfo) {
    var resolveUnit = function (moduleName, entry, destFile, destPath) {
        var unitOpt = {
            entries: [entry],
            paths: ['./src'],
            debug: !!globalConf.debug,
            insertGlobals: false,
            detectGlobals: false
        };

        if (conf.modulePrefix) {
            moduleName =  conf.modulePrefix + '.' + moduleName;
        }
        unitOpt.standalone = moduleName;
        browserifyUnit(destPath, destFile, unitOpt, conf, channel, utils, taskInfo);
    };

    unitList.forEach(function (unitParam) {
        var destPath = unitParam.destPath;
        var destFile = unitParam.destFile;
        var pathObj = path.parse(unitParam.src);
        if (!destPath) {
            destPath = pathObj.dir;
        }
        if (!destFile) {
            destFile = pathObj.name.replace(/\.src$/, '')  + pathObj.ext;
        }
        resolveUnit(unitParam.moduleName, unitParam.src, destFile, destPath);
    });
};

module.exports = taskMchartUnit;