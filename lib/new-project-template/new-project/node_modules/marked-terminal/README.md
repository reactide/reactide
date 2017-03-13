marked-terminal
===

> Custom Renderer for [marked](https://github.com/chjj/marked)
allowing for printing Markdown to the Terminal. Supports pretty tables, syntax
highlighting for javascript, and overriding all colors and styles.

Could for instance be used to print usage information.

## Install

```sh
npm install marked marked-terminal
```

## Example

```javascript
var marked = require('marked');
var TerminalRenderer = require('marked-terminal');

marked.setOptions({
  // Define custom renderer
  renderer: new TerminalRenderer()
});

// Show the parsed data
console.log(marked('# Hello \n This is **markdown** printed in the `terminal`'));
```

This will produce the following:

![Screenshot of marked-terminal](./screenshot.png)


### Syntax Highlighting

Also have support for syntax highlighting using [cardinal](https://github.com/thlorenz/cardinal).
You can override highlight defaults by passing in settings as the second argument for TerminalRenderer,
or you can create a `.cardinalrc` as defined in the [cardinal README](https://github.com/thlorenz/cardinal).

Having the following markdown input:

<pre>
```js
var foo = function(bar) {
  console.log(bar);
};
foo('Hello');
```
</pre>

...we will convert it into terminal format:

```javascript
// Show the parsed data
console.log(marked(exampleSource));
```

This will produce the following:

![Screenshot of marked-terminal](./screenshot2.png)

## API

Constructur: `new TerminalRenderer([options][, highlightOptions])`

### `options`
Optional
Used to override default styling.

Default values are:

```javascript
var defaultOptions = {
  // Colors
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

  // Reflow and print-out width
  width: 80, // only applicable when reflow is true
  reflowText: false,

  // Should it prefix headers?
  showSectionPrefix: true,

  // Whether or not to undo marked escaping
  // of enitities (" -> &quot; etc)
  unescape: true,

  // Whether or not to show emojis
  emoji: true,

  // Options passed to cli-table
  tableOptions: {},

  // The size of tabs in number of spaces or as tab characters
  tab: 3 // examples: 4, 2, \t, \t\t
};
```

#### Example of overriding defaults
```javascript
marked.setOptions({
  renderer: new TerminalRenderer({
    codespan: chalk.underline.magenta,
  })
});
```

### `highlightOptions`
Options passed into [cardinal](https://github.com/thlorenz/cardinal). See
readme there to see what options to pass.


See [more examples](./example/)
