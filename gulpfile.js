const { series, parallel, src, dest } = require('gulp');
const del = require('del');
const gulpConcat = require('gulp-concat');
const minify = require('gulp-babel-minify');

const sourceFolder = 'app';
const destFolder = 'dist';

function clean(cb) {
  del.bind(null, destFolder);

  cb();
}

function htmls(cb) {
  return src(`${sourceFolder}/*.html`).pipe(dest(destFolder));
}

function scripts(cb) {
  return src(`${sourceFolder}/{,*/}*.js`)
      .pipe(minify())
      .pipe(gulpConcat('bookmarklet.js'))
      .pipe(dest(destFolder));
}

exports.default = series(clean, parallel(scripts, htmls));
