// load modules
const gulp         = require('gulp');
const del          = require('del');
const fs           = require('fs');
const browsersync_server = require('browser-sync').create();
const htmlmin      = require('gulp-htmlmin');
const sass         = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const csso         = require('gulp-csso');
const sourcemaps   = require('gulp-sourcemaps');

// creates default src folder structure
function createStructure(done) {
  const folders = [
    'dist',
    'src',
    'src/fonts',
    'src/img',
    'src/scss',
  ];
  const files = [
    'src/index.html',
  ];

  folders.forEach(dir => {
    if(!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
      console.log('folder created:', dir);
    }
  });

  files.forEach(file => {
    if(!fs.existsSync(file)) {
      fs.writeFileSync(file, '');
      console.log('file created:', file);
    }
  });

  return done();
}

// deletes all assets (HTML, fonts, images) in dist
function cleanAssets(done) {
  return del(
    ['dist/**/*.html', 'dist/fonts/**/*', 'dist/img/**/*'],
    { force: true }
  );
}

// publish HTML files src into dist
function publishHtml(done, for_production = false) {
  let pipeline = gulp.src('src/**/*.html');

  if (for_production) {
    pipeline.pipe(htmlmin({ collapseWhitespace: true }));
  }

  return pipeline.pipe(gulp.dest('dist'));
}

// publish HTML for production
function publishHtmlProduction(done) {
  return publishHtml(done, true);
}

// publish HTML for development
function publishHtmlDevelopment(done) {
  return publishHtml(done, false);
}

// Copy all fonts from src/fonts into dist
function publishFonts(done) {
  return gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));
}

// Copy all images from src/img into dist
function publishImages(done) {
  return gulp.src('src/img/**/*')
    .pipe(gulp.dest('dist/img'));
}

// Copy all js files from src/js into dist
function publishJS(done) {
  return gulp.src('src/js/**/*')
    .pipe(gulp.dest('dist/js'));
}

// compile SCSS files
function compileScss(done, for_production = false) {
  let pipeline = gulp.src('src/scss/**/*.scss')
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))

  if (for_production) {
      pipeline.pipe(autoprefixer({
          overrideBrowserslist: [
              "last 2 version",
              "> 2%"
          ],
          cascade: false
      }))
      .pipe(csso());
  }

  return pipeline.pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/css'));
}

function compileScssProduction(done) {
  return compileScss(done, true);
}

function compileScssDevelopment(done) {
  return compileScss(done, false);
}

// watch files
function watchFiles(done) {
  gulp.watch("src/**/*.html", gulp.series(publishHtml, reload));
  gulp.watch("src/fonts/**/*", gulp.series(publishFonts, reload));
  gulp.watch("src/img/**/*", gulp.series(publishImages, reload));
  gulp.watch("src/js/**/*", gulp.series(publishJS, reload));
  gulp.watch("src/scss/**/*.scss", gulp.series(compileScss, reload));
}

// browserSync server
function serve(done) {
  browsersync_server.init({
    server: {
      baseDir: './dist/'
    }
  });
  done();
}

// browserSync reload
function reload(done) {
  browsersync_server.reload();
  done();
}

// export tasks
exports.structure = createStructure;

exports.publish = gulp.series(
  cleanAssets,
  publishHtml,
  publishFonts,
  publishImages,
  publishJS,
);

exports.build_prod = gulp.series(
  cleanAssets,
  publishHtmlProduction,
  publishFonts,
  publishImages,
  publishJS,
  compileScssProduction,
);

exports.build_dev = gulp.series(
  cleanAssets,
  publishHtmlDevelopment,
  publishFonts,
  publishImages,
  publishJS,
  compileScssDevelopment,
);

exports.watch = gulp.series(
  cleanAssets,
  publishHtmlDevelopment,
  publishFonts,
  publishImages,
  publishJS,
  compileScssDevelopment,
  serve,
  watchFiles,
);
