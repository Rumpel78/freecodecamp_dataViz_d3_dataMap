/*eslint-disable */
var gulp = require('gulp');
var gulpSequence = require('gulp-sequence');

var webpack = require('webpack-stream');

var browserSync = require('browser-sync');

var compressJs = require('gulp-uglify');
var compressCss = require('gulp-cssnano');
var rimraf = require('gulp-rimraf');

var concat = require('gulp-concat');
var replace = require('gulp-replace');

var reload = browserSync.reload;

// Browser
gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: "./build/"
    },
    files: ['./build/**/*.*'],
    port: 5000,
  });
});

// Watch
gulp.task('watch', function() {
  gulp.watch('src/js/**/*.js', ['build:js']);
  gulp.watch('src/css/**/*', ['build:css']);
  gulp.watch('src/*.html', ['build:html:dev']);
  gulp.watch('src/datasets/*', ['move:datasets']);
  gulp.watch('src/assets/**/*', ['move:assets']);
  gulp.watch('src/fonts/*', ['move:fonts']);
});

// Javascript 
gulp.task('build:js', function() {
  return gulp.src('./src/js/index.js')
    .pipe(
      webpack(require('./webpack.config.js'), null, (err,stat)=>{browserSync.reload()})
      .on('error', function(error) {
            console.error(error.message);
            this.emit('end');
      })   
     )
    .pipe(gulp.dest('./build/js'));
});


// COMPRESSION
gulp.task('compress:js', ['clean:map'], function() {
  return gulp.src('build/js/*.js')
    .pipe(compressJs())
    .pipe(gulp.dest('./build/js'));
});

gulp.task('compress:css', function() {
  return gulp.src('build/css/*.css')
    .pipe(compressCss())
    .pipe(gulp.dest('./build/css'));
});

// HTML
var envReplace = function (env) {
  return gulp.src(['src/index.html'])
    .pipe(replace('__REPLACE_ENV__', env))
    .pipe(gulp.dest('./build'));
}

gulp.task('build:html:dev', function() {
  return envReplace('development');
});

gulp.task('build:html:dist', function() {
  return envReplace('production');
});

// CSS
gulp.task('build:css', function() {
  return gulp.src('./src/css/**/*')
  .pipe(gulp.dest('build/css'))
  .pipe(reload({stream:true}));
});

// Datasets
gulp.task('move:datasets', function() {
  return gulp.src('./src/datasets/*')
  .pipe(gulp.dest('build/datasets'))
  .pipe(reload({stream:true}));
});

// Fonts
gulp.task('move:fonts', function() {
  return gulp.src('./src/fonts/*')
  .pipe(gulp.dest('./build/fonts'))
  .pipe(reload({stream:true}));
});

// Assets
gulp.task('move:assets', function() {
  return gulp.src('./src/assets/**/*')
  .pipe(gulp.dest('./build/assets'))
  .pipe(reload({stream:true}));
});

// Clean
gulp.task('clean', function() {
   return gulp.src('./build/*', { read: false })
		.pipe(rimraf({ force: true }));
});

gulp.task('clean:map', function () {
  return gulp.src('./build/js/*.js.map', { read: false })
    .pipe(rimraf({ force: true }));
});

gulp.task('move', ['move:datasets', 'move:fonts', 'move:assets']);
gulp.task('build:assets', ['build:js', 'build:css', 'move']);
gulp.task('compress', ['compress:js', 'compress:css']);

gulp.task('default', gulpSequence('clean', ['build:html:dev', 'build:assets'], 'browser-sync', 'watch'));
gulp.task('dist', gulpSequence('clean', ['build:html:dist', 'build:assets'], 'compress'));
