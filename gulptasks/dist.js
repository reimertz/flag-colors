/* jshint node: true */
'use strict';

var gulp = require('gulp'),
    g = require('gulp-load-plugins')({lazy: false}),
    noop = g.util.noop,
    swig = require('gulp-swig'),
    flags = require('../data/flagColors.js').getAll(),
    version = require('../package.json').version,
    template = {
      version: version,
      flags: flags
    };

gulp.task('styles-dist', ['render-css','render-scss','render-less', 'render-sass', 'render-stylus'], noop);

gulp.task('render-scss', function () {
  return gulp.src(['templates/flag-colors.scss'])
    .on('error', g.notify.onError('<%= error.message%>'))
    .pipe(g.data(template))
    .pipe(swig())
    .pipe(g.rename('flag-colors.latest.scss'))
    .pipe(gulp.dest('dist/latest/scss/'))
    .pipe(g.rename('flag-colors.' + version + '.scss'))
    .pipe(gulp.dest('dist/'+ version + '/scss/'));
});

gulp.task('render-less', function () {
  return gulp.src(['templates/flag-colors.less'])
    .on('error', g.notify.onError('<%= error.message%>'))
    .pipe(g.data(template))
    .pipe(swig())
    .pipe(g.rename('flag-colors.latest.less'))
    .pipe(gulp.dest('dist/latest/less/'))
    .pipe(g.rename('flag-colors.' + version + '.less'))
    .pipe(gulp.dest('dist/'+ version + '/less/'));
});

gulp.task('render-sass', function () {
  return gulp.src(['templates/flag-colors.sass'])
    .on('error', g.notify.onError('<%= error.message%>'))
    .pipe(g.data(template))
    .pipe(swig())
    .pipe(g.rename('flag-colors.latest.sass'))
    .pipe(gulp.dest('dist/latest/sass/'))
    .pipe(g.rename('flag-colors.' + version + '.sass'))
    .pipe(gulp.dest('dist/'+ version + '/sass/'));
});

gulp.task('render-stylus', function () {
  return gulp.src(['templates/flag-colors.styl'])
    .on('error', g.notify.onError('<%= error.message%>'))
    .pipe(g.data(template))
    .pipe(swig())
    .pipe(g.rename('flag-colors.latest.styl'))
    .pipe(gulp.dest('dist/latest/stylus/'))
    .pipe(g.rename('flag-colors.' + version + '.styl'))
    .pipe(gulp.dest('dist/'+ version + '/stylus/'));
});


gulp.task('render-css', function () {
  return gulp.src(['templates/flag-colors.css'])
    .on('error', g.notify.onError('<%= error.message%>'))
    .pipe(g.data(template))
    .pipe(swig())
    .pipe(g.rename('flag-colors.latest.css'))
    .pipe(gulp.dest('dist/latest/css/'))
    .pipe(g.rename('flag-colors.' + version + '.css'))
    .pipe(gulp.dest('dist/'+ version + '/css/'))
    .pipe(g.minifyCss())
    .pipe(g.rename('flag-colors.' + version + '.min.css'))
    .pipe(gulp.dest('dist/'+ version + '/css/'))
    .pipe(g.rename('flag-colors.latest.min.css'))
    .pipe(gulp.dest('dist/latest/css/'));
});

