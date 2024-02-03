var syntax = 'scss',
  gulpversion = '4'

var gulp = require('gulp'),
  proxy = 'modesti.loc',
  themename = 'lego', // Change your theme name
  autoprefixer = require('gulp-autoprefixer'),
  browsersync = require('browser-sync'),
  concat = require('gulp-concat'),
  cache = require('gulp-cache'),
  cleancss = require('gulp-clean-css'),
  pngquant = require('imagemin-pngquant'),
  mozjpeg = require('imagemin-mozjpeg'),
  imagemin = require('gulp-imagemin'),
  notify = require('gulp-notify'),
  gutil = require('gulp-util'),
  rename = require('gulp-rename'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps')
uglify = require('gulp-uglify-es').default

gulp.task('browser-sync', function () {
  browsersync({
    proxy:  proxy,
    notify: true,
    // open: true,
    // tunnel: true,
    // tunnel: "gulp-wp-fast-start", //Demonstration page:
    // http://gulp-wp-fast-start.localtunnel.me
  })
})

// Combine scss files, compress and rename
gulp.task('styles', function () {
  return gulp.src(
    './' + themename + '/dev/sass/**/*.scss').
    pipe(sourcemaps.init()).
    pipe(sass({ outputStyle: 'expand' }).on('error', notify.onError())).
    pipe(rename({ suffix: '.min', prefix: '' })).
    pipe(concat('styles.css')).
    pipe(autoprefixer(['last 15 versions'])).
    pipe(cleancss(
      { level: { 1: { specialComments: 0 } } })) // Opt., comment out when
    // debugging
    .pipe(sourcemaps.write()).
    pipe(gulp.dest('./' + themename + '/css')).
    pipe(browsersync.stream())
})

// Combine script files, compress and rename
gulp.task('scripts', function () {
  return gulp.src([
    './' + themename + '/dev/js/index.js',
    // './' + themename + '/dev/js/libs/jquery.fancybox.min.js', // Connecting my scripts
    // './' + themename + '/dev/js/libs/slick.js', // Connecting
    './' + themename + '/dev/js/common.js', // Always
                                                                     // at the
    // end
  ]).
    pipe(concat('scripts.min.js')).
    pipe(uglify()) // Mifify js (opt.)gulp
    .pipe(gulp.dest('./' + themename + '/js')).
    pipe(browsersync.reload({ stream: true }))
})

// compress the pictures in the images folder in the template, and return them there in the finished
gulp.task('imgmin-theme', function () {
  return gulp.src('./' + themename + '/img/**/*').
    pipe(cache(imagemin())) // Cache Images
    .pipe(gulp.dest('./' + themename + '/img'))
})

// we compress the pictures in the uploads folder, and return gulp to the same place in the finished form
gulp.task('imgmin-uploads', function () {
  return gulp.src('../uploads/**/*').pipe(imagemin([
      mozjpeg({ quality: 80 }),
      // pngquant({quality: [0.7, 0.7]}),
    ],
    {
      interlaced:  true,
      progressive: true,
      svgoPlugins: [{ removeViewBox: false }],
      verbose:     true,
    },
  )) // Cache Images
    .pipe(gulp.dest('../uploads'))
})

if (gulpversion == 3) {
  gulp.task('watch', ['styles', 'scripts', 'browser-sync'], function () {
    gulp.watch(
      ['./' + themename + '/dev/sass/**/*.scss'],
      ['styles']) 
      gulp.watch(['./'+ themename +'/dev/js/**/*.js',
    './'+ themename +'/dev/js/common.js'], ['scripts']);
    
    gulp.watch('' + themename + '/**/*.php',
      browsersync.reload) 
  })
  gulp.task('default', ['watch'])
}

if (gulpversion == 4) {
  gulp.task('watch', function () {
    gulp.watch(
      ['./' + themename + '/dev/sass/**/*.scss'],
      gulp.parallel('styles')) 
    
    gulp.watch([
        '/' + themename + '/dev/js/**/*.js',
        '.' + themename + '/dev/js/common.js',
      ],
      gulp.parallel('scripts')) 
    gulp.watch('./' + themename + '/**/*.php',
      browsersync.reload) 
  })
  gulp.task('default', gulp.parallel('styles', 'watch'))
}
