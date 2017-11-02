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

const md = `
# Sample barchart
![barchart](data:image/png;base64,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)
`;

const html = `<h1 id="sample-barchart">Sample barchart</h1>\n<p><img src="data:image/png;base64,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" alt="barchart"></p>\n`;

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
    stream.on('end', done);
    stream.on('data', function(data) {
      assert.equal(md, data.contents.toString());
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
    stream.on('end', done);
    stream.on('data', function(data) {
      assert.equal(html, data.contents.toString());
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
    // stream.on('error', err => console.error(err));
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
