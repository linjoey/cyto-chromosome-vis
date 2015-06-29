
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var SOURCE_FILES = [
  'src/chromosome.js',
  'src/model-loader.js',
  'src/selector.js',
  'src/utils.js',
  'src/angular.adapter.js'
];

gulp.task('default', ['build', 'dev']);

gulp.task('dev', function(){
  gulp.src(SOURCE_FILES)
    .pipe(concat('cyto-chromosome.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('.'));
});

gulp.task('build', function(){
  gulp.src(SOURCE_FILES)
    .pipe(concat('cyto-chromosome.js'))
    .pipe(gulp.dest('.'));
});