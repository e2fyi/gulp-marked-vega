/**
 * [gulp]{@link https://gulpjs.com} plugin to replace [marked-vega]{@link https://www.webcomponents.org/element/PolymerVis/marked-vega}
 * codeblocks with base64 image markdown tags so that any markdown parser can
 * render the Vega or Vega-Lite charts as images.
 * @module gulp-marked-vega
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
module.exports = require('./lib/gulp-plugin');
