'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');
var buffer = require('vinyl-buffer');

function buildBundle () {
    return browserify({debug:true}).add('./src/index.js')
        .require('./src/chromosome.js', {expose:"cyto-chromosome-vis"})
        .bundle();
}

gulp.task('default',['build-dev', 'release'], function(){});

gulp.task('build-dev', function() {
    return buildBundle()
        .pipe(source('cyto-chromosome.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('release', function(){
    return buildBundle()
        .pipe(source('cyto-chromosome.min.js'))
        .pipe(buffer())
        .pipe(streamify(uglify()))
        .pipe(gulp.dest('./dist'));
});