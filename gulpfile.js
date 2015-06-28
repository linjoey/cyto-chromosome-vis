
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('build', function(){
  gulp.src('./src/*')
    .pipe(concat('chromosome-map.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('.'));
});