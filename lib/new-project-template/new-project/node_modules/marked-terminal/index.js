"use strict";

var chalk = require('chalk');
var Table = require('cli-table');
var assign = require('lodash.assign');
var cardinal = require('cardinal');
var emoji = require('node-emoji');

var TABLE_CELL_SPLIT = '^*||*^';
var TABLE_ROW_WRAP = '*|*|*|*';
var TABLE_ROW_WRAP_REGEXP = new RegExp(escapeRegExp(TABLE_ROW_WRAP), 'g');

var COLON_REPLACER = '*#COLON|*';
var COLON_REPLACER_REGEXP = new RegExp(escapeRegExp(COLON_REPLACER), 'g');

var TAB_ALLOWED_CHARACTERS = ['\t'];

// HARD_RETURN holds a character sequence used to indicate text has a
// hard (no-reflowing) line break.  Previously \r and \r\n were turned
// into \n in marked's lexer- preprocessing step. So \r is safe to use
// to indicate a hard (non-reflowed) return.
var HARD_RETURN = '\r',
    HARD_RETURN_RE = new RegExp(HARD_RETURN),
    HARD_RETURN_GFM_RE = new RegExp(HARD_RETURN + '|<br />');

var defaultOptions = {
  code: chalk.yellow,
  blockquote: chalk.gray.italic,
  html: chalk.gray,
  heading: chalk.green.bold,
  firstHeading: chalk.magenta.underline.bold,
  hr: chalk.reset,
  listitem: chalk.reset,
  table: chalk.reset,
  paragraph: chalk.reset,
  strong: chalk.bold,
  em: chalk.italic,
  codespan: chalk.yellow,
  del: chalk.dim.gray.strikethrough,
  link: chalk.blue,
  href: chalk.blue.underline,
  text: identity,
  unescape: true,
  emoji: true,
  width: 80,
  showSectionPrefix: true,
  reflowText: false,
  tab: 3,
  tableOptions: {}
};

function Renderer(options, highlightOptions) {
  this.o = assign({}, defaultOptions, options);
  this.tab = sanitizeTab(this.o.tab, defaultOptions.tab);
  this.tableSettings = this.o.tableOptions;
  this.emoji = this.o.emoji ? insertEmojis : identity;
  this.unescape = this.o.unescape ? unescapeEntities : identity;
  this.highlightOptions = highlightOptions || {};

  this.transform = compose(undoColon, this.unescape, this.emoji);
};

// Compute length of str not including ANSI escape codes.
// See http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
function textLength(str) {
  return str.replace(/\u001b\[(?:\d{1,3})(?:;\d{1,3})*m/g, "").length;
};

Renderer.prototype.textLength = textLength;

function fixHardReturn(text, reflow) {
  return reflow ? text.replace(HARD_RETURN, /\n/g) : text;
}

Renderer.prototype.text = function (text) {
  return this.o.text(text);
};

Renderer.prototype.code = function(code, lang, escaped) {
  return '\n' + indentify(highlight(code, lang, this.o, this.highlightOptions), this.tab) + '\n\n';
};

Renderer.prototype.blockquote = function(quote) {
  return '\n' + this.o.blockquote(indentify(quote.trim(), this.tab)) + '\n\n';
};

Renderer.prototype.html = function(html) {
  return this.o.html(html);
};

Renderer.prototype.heading = function(text, level, raw) {
  text = this.transform(text);

  var prefix = this.o.showSectionPrefix ?
    (new Array(level + 1)).join('#')+' ' : '';
  text = prefix + text;
  if (this.o.reflowText) {
    text = reflowText(text, this.o.width, this.options.gfm);
  }
  if (level === 1) {
    return this.o.firstHeading(text) + '\n';
  }
  return this.o.heading(text) + '\n';
};

Renderer.prototype.hr = function() {
  return this.o.hr(hr('-', this.o.reflowText && this.o.width)) + '\n';
};

Renderer.prototype.list = function(body, ordered) {
  body = indentLines(this.o.listitem(body), this.tab);
  if (!ordered) return body;
  return changeToOrdered(body);
};

Renderer.prototype.listitem = function(text) {
  var isNested = ~text.indexOf('\n');
  if (isNested) text = text.trim();
  return '\n * ' + this.transform(text);
};

Renderer.prototype.paragraph = function(text) {
  var transform = compose(this.o.paragraph, this.transform);
  text = transform(text);
  if (this.o.reflowText) {
    text = reflowText(text, this.o.width, this.options.gfm);
  }
  return text + '\n\n';
};

Renderer.prototype.table = function(header, body) {
  var table = new Table(assign({}, {
      head: generateTableRow(header)[0]
  }, this.tableSettings));

  generateTableRow(body, this.transform).forEach(function (row) {
    table.push(row);
  });
  return this.o.table(table.toString()) + '\n\n';
};

Renderer.prototype.tablerow = function(content) {
  return TABLE_ROW_WRAP + content + TABLE_ROW_WRAP + '\n';
};

Renderer.prototype.tablecell = function(content, flags) {
  return content + TABLE_CELL_SPLIT;
};

// span level renderer
Renderer.prototype.strong = function(text) {
  return this.o.strong(text);
};

Renderer.prototype.em = function(text) {
  text = fixHardReturn(text, this.o.reflowText);
  return this.o.em(text);
};

Renderer.prototype.codespan = function(text) {
  text = fixHardReturn(text, this.o.reflowText);
  return this.o.codespan(text.replace(/:/g, COLON_REPLACER));
};

Renderer.prototype.br = function() {
  return this.o.reflowText ? HARD_RETURN : '\n';
};

Renderer.prototype.del = function(text) {
  return this.o.del(text);
};

Renderer.prototype.link = function(href, title, text) {
  if (this.options.sanitize) {
    try {
      var prot = decodeURIComponent(unescape(href))
        .replace(/[^\w:]/g, '')
        .toLowerCase();
    } catch (e) {
      return '';
    }
    if (prot.indexOf('javascript:') === 0) {
      return '';
    }
  }

  var hasText = text && text !== href;

  var out = '';
  if (hasText) out += this.emoji(text) + ' (';
  out +=  this.o.href(href);
  if (hasText) out += ')';

  return this.o.link(out);
};

Renderer.prototype.image = function(href, title, text) {
  var out = '!['+text;
  if (title) out += ' – ' + title;
  return out + '](' + href + ')\n';
};

module.exports = Renderer;

// Munge \n's and spaces in "text" so that the number of
// characters between \n's is less than or equal to "width".
function reflowText (text, width, gfm) {
  // Hard break was inserted by Renderer.prototype.br or is
  // <br /> when gfm is true
  var splitRe = gfm ? HARD_RETURN_GFM_RE : HARD_RETURN_RE,
      sections = text.split(splitRe),
      reflowed = [];

  sections.forEach(function (section) {
    var words = section.split(/[ \t\n]+/),
        column = 0,
        nextText = '';

    words.forEach(function (word) {
      var addOne = column != 0;
      if ((column + textLength(word) + addOne) > width) {
        nextText += '\n';
        column = 0;
      } else if (addOne) {
        nextText += " ";
        column += 1;
      }
      nextText += word;
      column += textLength(word);
    });
    reflowed.push(nextText);
  });
  return reflowed.join('\n');
}

function indentLines (text, tab) {
  return text.replace(/\n/g, '\n' + tab) + '\n\n';
}

function changeToOrdered(text) {
  var i = 1;
  return text.split('\n').reduce(function (acc, line) {
    if (!line) return '\n' + acc;
    return acc + line.replace(/(\s*)\*/, '$1' + (i++) + '.') + '\n';
  });
}

function highlight(code, lang, opts, hightlightOpts) {
  if (!chalk.enabled) return code;

  var style = opts.code;

  code = fixHardReturn(code, opts.reflowText);
  if (lang !== 'javascript' && lang !== 'js') {
    return style(code);
  }

  try {
    return cardinal.highlight(code, hightlightOpts);
  } catch (e) {
    return style(code);
  }
}

function insertEmojis(text) {
  return text.replace(/:([A-Za-z0-9_\-\+]+?):/g, function (emojiString) {
    var emojiSign = emoji.get(emojiString);
    if (!emojiSign) return emojiString;
    return emojiSign + ' ';
  });
}

function hr(inputHrStr, length) {
  length = length || process.stdout.columns;
  return (new Array(length)).join(inputHrStr);
}

function undoColon (str) {
  return str.replace(COLON_REPLACER_REGEXP, ':');
}

function indentify(text, tab) {
  if (!text) return text;
  return tab + text.split('\n').join('\n' + tab);
}

function generateTableRow(text, escape) {
  if (!text) return [];
  escape = escape || identity;
  var lines = escape(text).split('\n');

  var data = [];
  lines.forEach(function (line) {
    if (!line) return;
    var parsed = line.replace(TABLE_ROW_WRAP_REGEXP, '').split(TABLE_CELL_SPLIT);

    data.push(parsed.splice(0, parsed.length - 1));
  });
  return data;
}

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function unescapeEntities(html) {
  return html
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
}

function identity (str) {
  return str;
}

function compose () {
  var funcs = arguments;
  return function() {
    var args = arguments;
    for (var i = funcs.length; i-- > 0;) {
      args = [funcs[i].apply(this, args)];
    }
    return args[0];
  };
}

function isAllowedTabString (string) {
  return TAB_ALLOWED_CHARACTERS.some(function (char) {
    return string.match('^('+char+')+$');
  });
}

function sanitizeTab (tab, fallbackTab) {
  if (typeof tab === 'number') {
    return (new Array(tab + 1)).join(' ');
  } else if (typeof tab === 'string' && isAllowedTabString(tab)) {
    return tab;
  } else {
    return (new Array(fallbackTab + 1)).join(' ');
  }
}
