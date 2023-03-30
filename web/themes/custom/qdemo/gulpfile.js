var fs = require('fs')
var del = require('del')
var runSequence = require('run-sequence')
var autoprefixer = require('autoprefixer')
var gulp = require('gulp')
var sass = require('gulp-sass')
// var scsslint = require('gulp-scss-lint')
var rename = require('gulp-rename')
var postcss = require('gulp-postcss')
var imagemin = require('gulp-imagemin')
var bump = require('gulp-bump')
var concat = require('gulp-concat')
var replace = require('gulp-replace')
var uglify = require('gulp-uglify')
var plumber = require("gulp-plumber")
var sourcemaps = require('gulp-sourcemaps')
var gap = require('gulp-append-prepend')

var paths = {
    dist: './build/',
    root: './app/',

    js: {
        src: './app/js/',
        dist: './build/js/'
    },
    css: {
        src: './app/css',
        dist: './build/css'
    },
}

var staticFiles = [
    paths.src + 'images/**/*',
    paths.src + 'font/**/*',
]

gulp.task('clean', function(cb) {
	return del([paths.dist + '**/*'], cb);
})

gulp.task('styles', function() {
    var sassOptions = {
        outputStyle: 'compressed'
    }
    var processors = [
        autoprefixer({ 
            browsers: [
                'last 2 versions'
            ]
        })
    ]

    return gulp.src('./app/scss/**')
        .pipe(plumber()) // onerror won't break gulp task
        .pipe(sourcemaps.init())
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.css.dist));
})

gulp.task('scripts', function(){
  return gulp.src('./app/js/**')
    .pipe(sourcemaps.init())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.js.dist));

});

gulp.task('images', function(){
  return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
  .pipe(imagemin())
  .pipe(gulp.dest('build/images'))
});

// Watch task

gulp.task('styles:watch', function() {
    gulp.watch(paths.root + '**/*.scss', ['styles'])
})

gulp.task('scripts:watch', function() {
    gulp.watch(paths.js.src + '**/*.js', ['scripts'])
})

gulp.task('images:watch', function() {
    gulp.watch(paths.src + '**/*.+(png|jpg|gif|svg)', ['images'])
})

gulp.task('static', function() {
    
    return gulp.src(staticFiles, {
            base: paths.src
        })
        .pipe(gulp.dest(paths.dist));
})

gulp.task('static:watch', function() {
	gulp.watch(staticFiles, ['static'])
})

gulp.task('bump', function() {
	return gulp.src(['./bower.json', './package.json'])
        .pipe(bump({
            type: 'patch'
        }))
        .pipe(gulp.dest(paths.dist))
})

gulp.task('build', function() {
    runSequence('clean', ['scripts', 'styles', 'images', 'static']);
})

gulp.task('watch', ['styles:watch', 'scripts:watch', 'images:watch', 'static:watch'])

