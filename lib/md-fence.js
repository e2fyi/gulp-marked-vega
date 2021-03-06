(function() {
  /**
   * @module
   */

  /**
  * @typedef {Object} Block  Parsed chunk of information about the Markdown text.
  * @property {String} type     Type of block - either `raw` or `fence`.
  * @property {String} lang     Language text for the codeblock.
  * @property {String} symbol   Character used to open and close the block.
  * @property {String} open     String used to open the block. e.g. "```" or "~~~".
  * @property {String} close    String used to close the block. e.g. "```" or "~~~".
  * @property {String} content  String inside the block.
  */

  /**
   * Simple String wrapper class to help navigate the characters within the String.
   * @example
   * var feed = new TextFeed('some random text here!');
   * console.log(feed.peek());  // prints 's'
   * console.log(feed.peek(1)); // prints 'o'
   * console.log(feed.next());  // prints 's'
   * console.log(feed.next());  // prints 'o'
   * console.log(feed.next(2)); // prints 'me'
   * console.log(feed.skip(1)); // skip ' '
   * console.log(feed.next());  // prints 'r'
   */
  class TextFeed {
    /**
     * @param {String} str input string.
     */
    constructor(str) {
      this.str = str;
      this.ptr = 0;
    }
    /**
     * Return the next `n` characters and update the internal pointer.
     * @param {Number} [n=0] next `n` characters to return.
     * @return {String}
     */
    next(n = 0) {
      if (n > 0) {
        this.ptr += n;
        return this.str.slice(this.ptr - n, this.ptr);
      }
      return this.str.charAt(this.ptr++);
    }
    /**
     * Return the next `n` characters but do not update the internal pointer.
     * @param {Number} [n=0] next `n` characters to peek.
     * @return {String}
     */
    peek(n = 0) {
      return this.str.charAt(this.ptr + n);
    }
    /**
     * Skip the next `n` characters and return a reference to itself.
     * @param {Number} [n=1] number of characters to skip.
     * @return {TextFeed}
     */
    skip(n = 1) {
      this.ptr += n;
      return this;
    }
    /**
     * Return the internal string.
     * @return {String}
     */
    toString() {
      return this.str;
    }
  }

  /**
   * Super simple markdown parser just for `fence` only.
   * @example
   * var md = fs.readFileSync('README.md', {encoding: 'utf8'});
   * var fence = new MdFence(['vg', 'vega', 'vega-lite', 'vl']);
   * console.log(fence.eat(md).blocks); // prints parsed blocks
   */
  class MdFence {
    constructor() {
      this._blocks = [];
      this._current = null;
    }
    /**
     * A internal list of `block` that has been parsed but not been transformed yet.
     * @return {Block[]}
     */
    get blocks() {
      return this._blocks;
    }
    /**
     * Consume a String and update the internal `Blocks`. You can call `eat`
     * multiple times as the internal state will be updated. Return a reference
     * to itself.
     * @param {String} str Markdown string to parse.
     * @return {MdFence}
     */
    eat(str) {
      if (!str || str.length === 0) return this;
      var feed = new TextFeed(str);
      while (feed.peek()) {
        let res = MdFence.isFence(feed, this._current && this._current.symbol);

        if (res) {
          if (this._current) {
            this._blocks.push(this._current);
          }
          if (this._current.type === 'fence') {
            // close
            this._current.close = res.bracket;
            this._current = null;
          } else {
            // open
            this._current = {
              type: 'fence',
              open: res.bracket,
              symbol: res.symbol,
              lang: MdFence.getFenceLang(feed),
              content: ''
            };
          }
          continue;
        }
        if (this._current) {
          this._current.content += feed.next();
        } else {
          this._current = {type: 'raw', content: feed.next()};
        }
      }
      return this;
    }

    /**
     * Resolve all the current `Blocks` and transform them. Will empty the current
     * `Block` queue. Return a `Promise` as the transform function can be async.
     * @param {Function} [fn = ({content, lang}) => content] Transform function that takes in a `Block` object and output a String.
     * @return {Promise}
     */
    transform(fn = ({content, lang}) => content) {
      var promises = this.blocks.map(block => {
        var p = fn(block);
        if (p) return Promise.resolve(p);
        return Promise.resolve(MdFence.block2String(block));
      });
      this._blocks = [];
      return Promise.all(promises);
    }

    /**
     * Flush any unfinished blocks. Will close any `fence` if not closed.
     * @return {MdFence}
     */
    flush() {
      if (this._current) {
        if (this._current.type === 'fence' && !this._current.close) {
          this._current.close = this._current.open;
        }
        this._blocks.push(this._current);
      }
      this._current = null;
      return this;
    }
    /**
     * Convert a `Block` back to its String form.
     * @param {Block} block
     * @return {String}
     */
    static block2String(block) {
      if (block.type === 'fence')
        return `${block.open}${block.lang}\n${block.content}${block.close}`;
      return block.content;
    }
    /**
     * Peek and check if it is a fence. If so return the symbol used, and the
     * String used to open or close the fence.
     * Return false if not a fence.
     * @param {TextFeed} feed
     * @param {String} symbol
     * @return {{symbol: String, bracket: String}}
     */
    static isFence(feed, symbol) {
      if (!symbol) {
        return MdFence.isFence(feed, '`') || MdFence.isFence(feed, '~');
      }
      var i = 0;
      while (feed.peek(i) === symbol) {
        i += 1;
      }
      if (i >= 3) {
        let bracket = feed.next(i);
        return {symbol, bracket};
      }
      return false;
    }
    /**
     * Extract the language string after the code block.
     * @param {TextFeed} feed
     * @return {String}
     */
    static getFenceLang(feed) {
      var lang = [];
      while (feed.peek()) {
        let c = feed.next();
        if (/[\s\n\r\f\0]/.test(c)) {
          feed.skip(-1);
          break;
        }
        lang.push(c);
      }
      return lang.join('').toLowerCase();
    }
  }

  if (typeof module !== 'undefined' && typeof exports === 'object') {
    module.exports = MdFence;
  } else if (typeof define === 'function' && define.amd) {
    define(function() {
      return MdFence;
    });
  } else {
    this.MdFence = MdFence;
  }
}.call(
  (function() {
    return this || (typeof window !== 'undefined' ? window : global);
  })()
));
