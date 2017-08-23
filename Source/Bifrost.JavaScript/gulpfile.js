"use strict";

var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps');

var src = ['**/*.js', '!Bifrost*.js', '!node_modules/**/*.*', '!gulpfile.js', '!Libraries/**/*.*'];

gulp.task('lint', function () {
    return gulp.src(src)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('concat', function () {
    return gulp.src(src)
        .pipe(concat('Bifrost.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(''));
});

gulp.task('concat-with-sourcemaps', function () {
    return gulp.src(src)
        .pipe(sourcemaps.init())
        .pipe(concat('Bifrost.dev.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(''));
});

gulp.task('default', ['concat', 'concat-with-sourcemaps']);