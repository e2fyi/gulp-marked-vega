'use strict';
const path = require('path');
const gutil = require('gulp-util');
const through2 = require('through2');
const marked = require('marked');
const process = require('./md-vega');

/**
 * @module
 */
/**
 * [gulp]{@link https://gulpjs.com} plugin to replace [marked-vega]{@link https://www.webcomponents.org/element/PolymerVis/marked-vega}
 * codeblocks with base64 image markdown tags so that any markdown parser can
 * render the Vega or Vega-Lite charts as images.
 * If no `markedOpts` is passed as argument, the plugin will just replace the
 * `marked-vega` codeblocks - the output file will still be in markdown.
 * Otherwise, the plugin will replace and render the file as HTML using [marked]{@link https://github.com/chjj/marked} lib.
 * @param {{renderer: Function, gfm: Boolean, tables: Boolean, breaks: Boolean, pedantic: Boolean, sanitize: Boolean, smartLists: Boolean, smartypants: Boolean}} markedOpts Options to pass to `marked`.
 * @return {stream.Transform}
 * @example
 * const gulp = require('gulp');
 * const marked_vega = require('gulp-marked-vega');
 *
 * gulp
 *   .src('./test/sample.md')
 *   .pipe(marked_vega())
 *   .pipe(gulp.dest('test/output'));
 */
function plugin(markedOpts) {
  return through2.obj(function Parser(file, enc, cb) {
    if (file.isNull()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      cb(new gutil.PluginError('gulp-marked-vega', 'Streaming not supported'));
      return;
    }

    process(file.contents.toString())
      .then(text => {
        if (markedOpts) {
          marked.setOptions(markedOpts === true ? {} : markedOpts);
          text = marked(text);
          let dir = path.dirname(file.path);
          let filename = path.basename(file.path, path.extname(file.path));
          file.path = path.join(dir, filename + '.html');
        }
        file.contents = new Buffer(text);
        this.push(file);
        cb();
      })
      .catch(err => {
        this.emit(
          'error',
          new gutil.PluginError('gulp-marked-vega', err, {fileName: file.path})
        );
      });
  });
}

module.exports = plugin;
