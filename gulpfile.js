"use strict";
var Event = require('events');
var gulp = require('gulp');
var config = require('./tools/config.json');
var utils = require('./tools/utils');
var channel = new Event();

var taskList = [
    {
        name: 'server',
        core: require('./tools/task/task-server')
    },/*
    {
        name: 'less',
        core: require('./tools/task/task-less')
    },
    {
        name: 'demochart',
        core: require('./tools/task/task-demochart')
    },
    {
         name: 'demo',
         core: require('./tools/task/task-demo')
    },
    {
        name: 'gallery',
        core: require('./tools/task/task-gallery')
    },
    {
       name: 'chartindex',
       core: require('./tools/task/task-chartindex')
    },*/
    {
        name: 'mchart',
        core: require('./tools/task/task-mchart')
    }/*,
    {
        name: 'mchartunit',
        core: require('./tools/task/task-mchartunit'),
        extra: {
            active: ['line']
        }
    }*/
];
var taskConf = config.task;
var globalConf = config.global;

var runTask = function () {
    taskList.forEach(function (task) {
        task.core(channel, taskConf[task.name] || {}, globalConf, utils, task.extra);
    });
};

gulp.task('pre-publish-cdn', function () {
    var mchartBuild = require('./tools/task/task-mchart-build');
    mchartBuild(taskConf['mchartbuild'], globalConf, utils);
});
gulp.task('default', runTask);