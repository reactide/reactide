'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var reactify = require('reactify');
var envify = require('envify/custom');
var del = require('del');

var gulpUglify = require('gulp-uglify/minifier');
var uglifyJS = require('uglify-js');

gulp.task('clean', function (cb) {
    del(['dist', 'release'], cb);
});

gulp.task('bundle', function () {
    var b = browserify({
        entries: './renderer/hot.js',
        debug: false,
        node: true,
        bundleExternal: false,
        transform: [reactify, envify({
            NODE_ENV: 'production'
        })]
    });

    return b.bundle()
        .pipe(source('index.js'))
        .pipe(buffer())
        .pipe(gulpUglify({}, uglifyJS))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('html', function () {
    return gulp.src('./renderer/index.html')
        .pipe(gulp.dest('dist'));
});

// gulp.task('assets', function () {
//     return gulp.src('./src/assets/**/*', { "base" : "./src" })
//         .pipe(gulp.dest('dist'));
// });

gulp.task('default', ['html', 'bundle']);