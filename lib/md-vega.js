const vg = require('vega');
const vl = require('vega-lite');
const YAML = require('yamljs');
const MdFence = require('./md-fence');

/**
 * @module
 */

/**
 * Function to return an image Markdown tag with a base64 data of the rendered
 * Vega or Vega-Lite spec's image. Note that this is an **async** function.
 * Return `false` if not a [marked-vega]{@link https://www.webcomponents.org/element/PolymerVis/marked-vega} codeblock.
 * Otherwise return a `Promise` to the image Markdown tag.
 * @param {Block} block The `Block` to render.
 * @return {Promise|Boolean}
 */
function render({content, lang}) {
  var spec;

  if (lang === 'vl' || lang === 'vega-lite') {
    try {
      spec = JSON.parse(content);
    } catch (err) {
      try {
        spec = YAML.parse(content);
      } catch (err) {
        return false;
      }
    }
    spec = vl.compile(spec).spec;

    let view = new vg.View(vg.parse(spec)).renderer('none').initialize();

    return view.toImageURL('png').then(function(url) {
      return `![${spec.description}](${url})`;
    });
  }
  return false;
}

/**
 * Function to process markdown text and replace [marked-vega]{@link https://www.webcomponents.org/element/PolymerVis/marked-vega} codeblocks
 * with the correspondingg base64 embedded images. Return the `Promise` to the
 * modified markdown text.
 * @param {String} text The markdown text to process.
 * @return {Promise}
 */
function process(text) {
  var fence = new MdFence(['vega-lite', 'vl', 'vg', 'vega']);
  return fence
    .eat(text)
    .flush()
    .transform(render)
    .then(a => a.join(''));
}

module.exports = process;
