var gulp = require('gulp');
var gulpWatch = require('gulp-watch');
var less = require('gulp-less');
var LessPluginAutoPrefix = require('less-plugin-autoprefix');
var autoprefix= new LessPluginAutoPrefix({ browsers: ['last 2 versions'] });

var taskLess = function (channel, conf, globalConf, utils) {
      var lessTrans = function () {
            utils.log('Task', 'Demo Less');
            return gulp.src(conf.src)
                  .pipe(less({
                        plugins: [autoprefix]
                  })) 
                  .pipe(gulp.dest(conf.dest));
      };
      gulpWatch(conf.watch, function () {
            var stream = lessTrans();
            channel.emit('RELOAD', 'less', conf.reload.target);
      });

      lessTrans();
};

module.exports = taskLess;