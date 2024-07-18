
const gulp = require('gulp'),
      browserSync = require('browser-sync').create(),
      reload = browserSync.reload,
      sass = require('gulp-sass'),
      autoprefixer = require('gulp-autoprefixer'),
      cleancss = require('gulp-clean-css'),
      sourcemaps = require('gulp-sourcemaps'),
      concat = require('gulp-concat'),
      imagemin = require('gulp-imagemin'),
      changed = require('gulp-changed'),
      uglify = require('gulp-uglify'),
      lineec = require('gulp-line-ending-corrector');

// Compile Sass & Inject Into Browser
function css(done) {
  return gulp.src(['node_modules/bootstrap/scss/bootstrap.scss', 'src/scss/*.scss'])
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(sourcemaps.write())
    .pipe(lineec())
    .pipe(gulp.dest("src/css"))
    .pipe(browserSync.stream());
     done();
}

//Move JS Files to src/js
function js(done) {
  return gulp.src(['node_modules/bootstrap/dist/js/bootstrap.min.js', 'node_modules/jquery/dist/jquery.min.js', 'node_modules/popper.js/dist/umd/popper.min.js'])
    .pipe(uglify())
    .pipe(lineec())
    .pipe(gulp.dest("src/js"))
    .pipe(browserSync.stream());
     done();
}

//Watch Sass & Server
 function serve(done) {
  browserSync.init({
    server:"./src"
    //open: 'external',
    //proxy: 'http://localhost/dev',
    //port: 8080,
  });
  gulp.watch(['node_modules/bootstrap/scss/bootstrap.scss', 'src/scss/*.scss'], css);
  gulp.watch("src/*.html").on('change', browserSync.reload);
  done();
}

//Move Font folder to src/fonts
function fonts(done){
  return gulp.src('node_modules/font-awesome/fonts/*')
  .pipe(gulp.dest("src/fonts"));
   done();
}

//Move Font awesome css to src/css
function fa(done){
  return gulp.src('node_modules/font-awesome/css/font-awesome.min.css')
  .pipe(gulp.dest("src/css"));
   done();
}

exports.css = css;
exports.js = js;
exports.fonts = fonts;
exports.fa = fa;
exports.serve = serve;

const build = gulp.series( gulp.parallel(js,css,fa,fonts),serve);

gulp.task('default', build);
