/**
 * 各类型chart下的index.js
 */
var gulp = require('gulp');
var gulpWatch = require('gulp-watch');

var taskChartIndex = function (channel, conf, globalConf, utils) {
    utils.log('Sys', 'Start ChartIndex');
    gulpWatch(conf.src.entriesJs, function () {
        channel.emit('RELOAD', 'chartindex', conf.reload.target);
    });
    gulpWatch(conf.src.html, function () {
        channel.emit('RELOAD', 'chartindex', conf.reload.target);
    });
};

module.exports = taskChartIndex;