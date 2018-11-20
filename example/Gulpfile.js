var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var nodemon = require('gulp-nodemon');

gulp.task('serve', serve);

// simple gulp task to start the server
function serve() {
  nodemon({script: 'server/server.js'});
}


// gulps default task is to call the serve task
gulp.task('default', ['serve']);

gulp.task(‘browserify’, () => {
  return browserify(‘./src/main.js’)
    .bundle().
    .pipe(source(‘output.js’))
    .pipe(gulp.dest(‘./dist’));
});