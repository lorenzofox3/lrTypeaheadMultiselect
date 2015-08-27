var gulp = require('gulp');
var karma = require('karma').Server;
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var insert = require('gulp-insert');
var packageJson = require('./package.json');


gulp.task('karma-CI', function (done) {
  var conf = require('./test/karma.conf.js');
  conf.singleRun = true;
  conf.browsers = ['PhantomJS'];
  conf.basePath = './';
  var server = new karma(conf);
  server.start();
});

gulp.task('min', function () {
  gulp.src('./lrTypeaheadMultiselect.js')
    .pipe(concat('lrTypeaheadMultiselect.min.js'))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./'));
});

gulp.task('build', ['min', 'karma-CI'], function () {
  var version = packageJson.version;
  var string = '/** \n* @version ' + version + '\n* @license MIT\n*/\n';

  gulp.src('./lrTypeaheadMultiselect.js')
    .pipe(insert.prepend(string))
    .pipe(gulp.dest('./'));
});