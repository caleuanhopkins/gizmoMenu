// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var autoprefixer= require('gulp-autoprefixer');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
var cache = require('gulp-cache');
var minifycss = require('gulp-minify-css');
var cache = require('gulp-cache');
var paths = {
    scss: './_assets/scss/base/*.scss'
};
var sass = require('gulp-sass');

var gulp = require('gulp');

var connect = require('gulp-connect');


// Lint Task
gulp.task('lint', function() {
    return gulp.src('src/gizmoMenu.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('sass', function() {
    return gulp.src('src/gizmoMenu.scss')
        .pipe(sass(
            {
                style: 'expanded',
                errLogToConsole: false,
                onError: function(err) {
                    return notify().write(err);
                }
            }
        ))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss({ compatibility: 'ie8', noAdvanced: true }))
        .pipe(gulp.dest('dist'))
        .pipe(notify({ message: 'Dist Styles task complete' }));
});

gulp.task('demosass', function() {
    return gulp.src('demo/scss/gizmoMenu-example.scss')
        .pipe(sass(
            {
                style: 'expanded',
                errLogToConsole: false,
                onError: function(err) {
                    return notify().write(err);
                }
            }
        ))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss({ compatibility: 'ie8', noAdvanced: true }))
        .pipe(gulp.dest('demo/css'))
        .pipe(notify({ message: 'Demo Styles task complete' }));
});

gulp.task('scripts', function() {
    return gulp.src(
            'src/gizmoMenu.js'
        )
        .pipe(gulp.dest('dist'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist'))
        .pipe(notify({ message: 'Scripts task complete' }));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('src/gizmoMenu.js', ['scripts']);
    gulp.watch('src/gizmoMenu.scss', ['sass']);
    gulp.watch('demo/scss/gizmoMenu-example.scss', ['demosass']);
});

gulp.task('connect', function() {
  connect.server({
    port: 3000,
    livereload: true
  });
});

// Default Task
// Watch task removed for travis.ci. Add back in at the end of the list of tasks if you want gulp to auto updated your assets
gulp.task('demo', ['lint', 'sass', 'demosass', 'scripts', 'connect', 'watch']);

gulp.task('default', ['lint', 'sass', 'demosass', 'scripts']);
