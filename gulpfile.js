var gulp = require('gulp');
var clean = require('gulp-clean');
var rimraf = require('rimraf');
var jsdoc = require('gulp-jsdoc3');

var src = [
	'./node_modules/**/*'
];

var docSrc = [
	'ReadMe.md',
	'./template/js/modules/*.js'
];

gulp.task('modulecopy', function() {
	return gulp.src(src).pipe(gulp.dest('fixed/lib'));
});

gulp.task('clean', ['modulecopy'], function(cb) {
	rimraf('./node_modules/*', cb);
});
