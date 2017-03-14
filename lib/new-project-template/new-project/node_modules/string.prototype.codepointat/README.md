# ES6 `String.prototype.codePointAt` polyfill [![Build status](https://travis-ci.org/mathiasbynens/String.prototype.codePointAt.svg?branch=master)](https://travis-ci.org/mathiasbynens/String.prototype.codePointAt)

A robust & optimized ES3-compatible polyfill for [the `String.prototype.codePointAt` method in ECMAScript 6](http://people.mozilla.org/~jorendorff/es6-draft.html#sec-string.prototype.codepointat).

Other polyfills for `String.prototype.codePointAt` are available:

* <http://norbertlindenberg.com/2012/05/ecmascript-supplementary-characters/#String> by [Norbert Lindenberg](http://norbertlindenberg.com/) (fails some tests)
* <https://gist.github.com/slevithan/2290602> by [Steven Levithan](http://stevenlevithan.com/) (fails some tests)
* <https://github.com/paulmillr/es6-shim/blob/8e570a4b425a80f9b13ff027dbd28d65f201a319/es6-shim.js#L171-L183> by [Paul Miller](http://paulmillr.com/) (~~[fails some tests](https://github.com/paulmillr/es6-shim/issues/166)~~ passes all tests)

## Installation

In a browser:

```html
<script src="codepointat.js"></script>
```

Via [npm](http://npmjs.org/):

```bash
npm install string.prototype.codepointat
```

Then, in [Node.js](http://nodejs.org/):

```js
require('string.prototype.codepointat');

// On Windows and on Mac systems with default settings, case doesn’t matter,
// which allows you to do this instead:
require('String.prototype.codePointAt');
```

## Notes

[A polyfill + test suite for `String.fromCodePoint`](http://mths.be/fromcodepoint) is available, too.

## Author

| [![twitter/mathias](https://gravatar.com/avatar/24e08a9ea84deb17ae121074d0f17125?s=70)](https://twitter.com/mathias "Follow @mathias on Twitter") |
|---|
| [Mathias Bynens](http://mathiasbynens.be/) |

## License

This polyfill is available under the [MIT](http://mths.be/mit) license.
