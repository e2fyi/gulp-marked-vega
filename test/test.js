const fs = require('fs');
const assert = require('assert');
const gutil = require('gulp-util');
const MdFence = require('../lib/md-fence');
const plugin = require('../lib/gulp-plugin');

const sample = `
# Sample barchart
\`\`\`vega-lite
{
  "description": "barchart",
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
\`\`\`
`;

const blocks = [
  {type: 'raw', content: '\n# Sample barchart\n'},
  {
    type: 'fence',
    open: '```',
    symbol: '`',
    lang: 'vega-lite',
    content:
      '\n{\n  "description": "barchart",\n  "data": {\n    "values": [\n      {"a": "A","b": 28}, {"a": "B","b": 55}, {"a": "C","b": 43},\n      {"a": "D","b": 91}, {"a": "E","b": 81}, {"a": "F","b": 53},\n      {"a": "G","b": 19}, {"a": "H","b": 87}, {"a": "I","b": 52}\n    ]\n  },\n  "mark": "bar",\n  "encoding": {\n    "x": {"field": "a", "type": "ordinal"},\n    "y": {"field": "b", "type": "quantitative"}\n  }\n}\n',
    close: '```'
  }
];

const strings = blocks.map(b => b.content);

const md = fs.readFileSync(`${__dirname}/test.md`, {encoding: 'utf8'});
const html = fs.readFileSync(`${__dirname}/test.html`, {encoding: 'utf8'});

describe('MdFence', function() {
  var fence = new MdFence();

  describe('MdFence.eat(text)', function() {
    it('should return a "raw" block followed by a "fence" block.', function() {
      assert.deepEqual(blocks, fence.eat(sample).blocks);
    });
  });
  describe('MdFence.transform()', function() {
    it('should return an array of markdown string.', function(done) {
      fence.transform().then(str => {
        assert.deepEqual(strings, str);
        done();
      });
    });
  });
  describe('MdFence.blocks', function() {
    it('should return an empty array of blocks after transform.', function() {
      assert.equal(0, fence.blocks.length);
    });
  });
});

describe('plugin()', function() {
  it('should embed image in markdown', function(done) {
    var stream = plugin();
    stream.on('error', err => console.error(err));
    stream.on('end', done);
    stream.on('data', function(data) {
      // base64 is not consistent, just check the tag
      assert.equal(md.slice(0, 52), data.contents.toString().slice(0, 52));
    });
    stream.write(
      new gutil.File({
        contents: new Buffer(sample)
      })
    );
    stream.end();
  });
});
describe('plugin(true)', function() {
  it('should embed image in HTML', function(done) {
    var stream = plugin(true);
    stream.on('error', err => console.error(err));
    stream.on('end', done);
    stream.on('data', function(data) {
      // base64 is not consistent, just check the tag
      assert.equal(html.slice(0, 80), data.contents.toString().slice(0, 80));
    });
    stream.write(
      new gutil.File({
        contents: new Buffer(sample),
        path: 'sample.md'
      })
    );
    stream.end();
  });

  it('should rename path to *.html', function(done) {
    var stream = plugin(true);
    stream.on('error', err => console.error(err));
    stream.on('end', done);
    stream.on('data', function(data) {
      assert.equal('sample.html', data.path);
    });
    stream.write(
      new gutil.File({
        contents: new Buffer(sample),
        path: 'sample.md'
      })
    );
    stream.end();
  });
});
