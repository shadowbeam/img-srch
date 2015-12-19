var browserify = require('browserify');
var gulp = require('gulp');
var reactify = require('reactify');
var source = require('vinyl-source-stream');

gulp.task('browserify', function() {
	browserify('./src/js/app.js')
	.transform('reactify')
	.bundle()
        //Pass desired output filename to vinyl-source-stream
        .pipe(source('bundle.js'))
        // Start piping stream to tasks!
        .pipe(gulp.dest('./build/'));
    });

gulp.task('default', ['browserify'], function(){
	return gulp.watch('src/**/*.*', ['browserify'])
});
