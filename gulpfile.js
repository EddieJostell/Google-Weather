'use strict'

var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();


gulp.task('default', ['browser-sync']);

gulp.task('sass', function () {
	return gulp.src('./sass/default.scss')
	.pipe(sourcemaps.init())
	.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
	.pipe(sourcemaps.write())
	.pipe(gulp.dest('./css'))
	.pipe(browserSync.stream());
});

gulp.task('browser-sync', ['sass'], function() {
	browserSync.init({
		browser: 'chrome',
		server: "./"
	});
	gulp.watch('./sass/**/*.scss', ['sass']);
	gulp.watch("./*.html").on('change', browserSync.reload);
	gulp.watch("./js/*.js").on('change', browserSync.reload);
});