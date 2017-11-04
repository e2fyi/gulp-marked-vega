`gulp-marked-vega`
[![Build Status](https://travis-ci.org/e2fyi/gulp-marked-vega.svg?branch=master)](https://travis-ci.org/e2fyi/gulp-marked-vega)
[![Coverage Status](https://coveralls.io/repos/github/e2fyi/gulp-marked-vega/badge.svg?branch=master)](https://coveralls.io/github/e2fyi/gulp-marked-vega?branch=master)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
=================

[![NPM](https://nodei.co/npm-dl/gulp-marked-vega.png)](https://nodei.co/npm/gulp-marked-vega/)

`gulp-marked-vega` is a [gulp](https://gulpjs.com) plugin to replace
[`marked-vega`](https://www.webcomponents.org/element/PolymerVis/marked-vega)
codeblocks with base64 image markdown tags so that any markdown parser can
render the [Vega](https://vega.github.io/vega/) or [Vega-Lite](https://vega.github.io/vega-lite/)
charts as images.

Currently, only the `marked-vega` codebase markdown is supported.
The image markdown is not supported yet.

API documentation can be found at [https://e2fyi.github.io/gulp-marked-vega](https://e2fyi.github.io/gulp-marked-vega).

## Installation
Yarn
```
yarn add gulp-marked-vega -D
```
Npm
```
npm install gulp-marked-vega -D
```

## Usage
### Gulp
Replacing `marked-vega` codeblocks with image. Export as markdown.
```js
const gulp = require('gulp');
const marked_vega = require('gulp-marked-vega');

gulp
  .src('./test/sample.md')
  .pipe(marked_vega()) // replace codeblocks with image
  .pipe(gulp.dest('test/output')); // output as "test/output/sample.md"

```

Replacing `marked-vega` codeblocks with image. Export as HTML. Auto rename to `<original_filename>.html`.
```js
const gulp = require('gulp');
const marked_vega = require('gulp-marked-vega');

gulp
  .src('./test/sample.md')
  .pipe(marked_vega(true)) // replace codeblocks with image and export as html
  .pipe(gulp.dest('test/output')); // output as "test/output/sample.html"

```

More details on how to use Gulp as part of your build chain can be found at their
[site](https://github.com/gulpjs/gulp/blob/master/docs/README.md).

### Cli
There is also a cli to directly embed the Vega and Vega-Lite charts
in your markdown file.

```
usage: mdvg.js [-h] [-v] -f FILE [-o OUTPUT] [--html]

cli to replace marked-vega codeblocks with base64 embedded charts.

Optional arguments:
  -h, --help            Show this help message and exit.
  -v, --version         Show program's version number and exit.
  -f FILE, --file FILE  Input markdown file to process
  -o OUTPUT, --output OUTPUT
                        Output file to write to
  --html                Convert to HTML
```

Embed chart only.
```
mdvg -f ./test/sample.md -o ./test/sample_.md
```

Embed and convert to HTML.
```
mdvg -f ./test/sample.md -o ./test/sample_.md --html
```

## Special note on `canvas`
One of the underlaying lib to generate the image is [`canvas`](https://www.npmjs.com/package/canvas).
`canvas` has some special dependencies. Hence, you will get many error message if these are not met.
However, [`canvas-prebuilt`](https://www.npmjs.com/package/canvas-prebuilt) is also been included
to ensure that it will still work if `canvas` cannot be compiled properly.

Below is an extract from `canvas` repo:

> You can quickly install the dependencies by using the command for your OS:

OS | Command
----- | -----
OS X | `brew install pkg-config cairo pango libpng jpeg giflib`
Ubuntu | `sudo apt-get install libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev build-essential g++`
Fedora | `sudo yum install cairo cairo-devel cairomm-devel libjpeg-turbo-devel pango pango-devel pangomm pangomm-devel giflib-devel`
Solaris | `pkgin install cairo pango pkg-config xproto renderproto kbproto xextproto`
Windows | [Instructions on their wiki](https://github.com/Automattic/node-canvas/wiki/Installation---Windows)

## `marked-vega` custom Markdown Syntax
`marked-vega` introduces a few new markdown syntax.  

### 1. Image markdown
Syntax
~~~~
![vg|vega|vega-lite|vl](https://someurl/spec.json)
~~~~
Example
~~~~
![vega](barchart-vg.json)
~~~~

### 2. Code markdown
Syntax
~~~~
```vg|vega|vega-lite|vl
<Vega/Vega-Lite JSON specification>
or
<Vega/Vega-Lite JSON specification in YAML format>
```
~~~~
Example - JSON specification
~~~~
```vega-lite
{
  "data": {
    "values": [
      {"a": "A","b": 28}, {"a": "B","b": 55}, {"a": "C","b": 43},
      {"a": "D","b": 91}, {"a": "E","b": 81}, {"a": "F","b": 53},
      {"a": "G","b": 19}, {"a": "H","b": 87}, {"a": "I","b": 52}
    ]
  },
  "mark": "bar",
  "encoding": {
    "x": {"field": "a", "type": "ordinal"},
    "y": {"field": "b", "type": "quantitative"}
  }
}
```
~~~~

Example - YAML specification
~~~~
```vega-lite
data:
  values:
    - x: A
      y: 13
    - x: B
      y: 55
    - x: C
      y: 43
    - x: D
      y: 91      
    - x: E
      y: 81      
    - x: F
      y: 53      
    - x: G
      y: 19      
    - x: H
      y: 87      
    - x: I
      y: 52      
mark:
  bar
encoding:
  x:
    field: x
    type: ordinal
  y:
    field: y
    type: quantitative
```
~~~~

## Development
Compile and publish documentation to `/docs`.
```
npm run publish
```
Lint and Unit testing
```
npm test
```
Run demo
```
npm run demo
```

## Resources
- [Gulp](https://www.npmjs.com/package/gulp)
- [Vega specification](https://vega.github.io/vega/docs/)
- [Vega-Lite specification](https://vega.github.io/vega-lite/docs/)
- [Markdown guide](https://guides.github.com/features/mastering-markdown/)
