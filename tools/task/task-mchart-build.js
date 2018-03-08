var browserify = require('browserify');
var source = require('vinyl-source-stream');
var gulp = require('gulp');
var gulpHeader = require('gulp-header');
var pkg = require('../../package.json');
var bDerequire = require('browserify-derequire');

var bOpts = {
    paths: ['./src'],
    insertGlobals: false,
    detectGlobals: false,
    standalone: 'mchart'
};
var formatDate = function(timestamp){
    var date = new Date(timestamp),
        year = date.getFullYear(),
        month = date.getMonth(),
        day = date.getDate();
    var pad = function (v, p){
        return v > -1 && v < 10 ? (p = p || "0") + v : v;
    };
    return [
        year, "/",
        pad(month + 1, "0"), "/",
        pad(day, "0")
    ].join("");
};


var comment = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @date ' + formatDate(new Date().getTime()),
  ' * @version v<%= pkg.version %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');

var taskMchart = function (conf, globalConf, utils) {
    bOpts.entries = conf.src.entriesJs;
    bOpts.standalone = conf.moduleName;
    bOpts.debug = !!globalConf.debug;
    var bundle = function () {
        utils.log('Task', 'Build Mchart');
        return bundler.bundle()
            .on('error', function (err) {
                if (err.stack) {
                    console.log(err.message);
                    console.log(err.stack);
                }
                else {
                    console.log(err);
                }
            })
            .pipe(source(conf.dest.jsFile))
            .pipe(gulpHeader(comment, {
                pkg: pkg
            }))
            .pipe(gulp.dest(conf.dest.jsPath));
    };

    var bundler = browserify(bOpts).plugin(bDerequire);

    bundle();
    return bundler;
};

module.exports = taskMchart;