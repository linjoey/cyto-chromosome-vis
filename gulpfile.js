
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('default', ['build', 'dev']);

gulp.task('dev', function(){
  gulp.src('./src/*')
    .pipe(concat('cyto-chromosome.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('.'));
});

gulp.task('build', function(){
  gulp.src('./src/*')
    .pipe(concat('cyto-chromosome.js'))
    .pipe(gulp.dest('.'));
});