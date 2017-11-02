const gulp = require('gulp');
const mdVega = require('../index.js');

// replace as image tag in markdown
gulp
  .src('./demo/sample.md')
  .pipe(mdVega())
  .pipe(gulp.dest('demo/output'));

// convert to html
gulp
  .src('./demo/sample.md')
  .pipe(mdVega(true))
  .pipe(gulp.dest('demo/output'));
