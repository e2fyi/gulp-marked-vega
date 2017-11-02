#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const marked = require('marked');
const process = require('../lib/md-vega.js');
const ArgumentParser = require('argparse').ArgumentParser;
var parser = new ArgumentParser({
  version: '1.0.0',
  addHelp: true,
  description:
    'cli to replace marked-vega codeblocks with base64 embedded charts.'
});
parser.addArgument(['-f', '--file'], {
  help: 'Input markdown file to process',
  required: true
});
parser.addArgument(['-o', '--output'], {
  help: 'Output file to write to'
});
parser.addArgument(['--html'], {
  help: 'Convert to HTML',
  action: 'storeTrue'
});

var args = parser.parseArgs();
var {file, output, html} = args;
var text;

try {
  text = fs.readFileSync(file, {encoding: 'utf8'});
} catch (err) {
  console.error(err.stack);
}

process(text)
  .then(rtext => {
    if (html) {
      rtext = marked(rtext);
    }
    if (!output) console.info(rtext);
  })
  .catch(err => console.error(err));
