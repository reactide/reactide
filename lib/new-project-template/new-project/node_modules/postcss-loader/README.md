# PostCSS for Webpack [![Build Status][ci-img]][ci]

<img align="right" width="95" height="95"
     title="Philosopher’s stone, logo of PostCSS"
     src="http://postcss.github.io/postcss/logo.svg">

[PostCSS] loader for [webpack] to postprocesses your CSS with [PostCSS plugins].

<a href="https://evilmartians.com/?utm_source=postcss">
  <img src="https://evilmartians.com/badges/sponsored-by-evil-martians.svg"
       alt="Sponsored by Evil Martians" width="236" height="54">
</a>

[PostCSS plugins]: https://github.com/postcss/postcss#plugins
[PostCSS]:         https://github.com/postcss/postcss
[webpack]:         http://webpack.github.io/
[ci-img]:          https://travis-ci.org/postcss/postcss-loader.svg
[ci]:              https://travis-ci.org/postcss/postcss-loader

## Install

```sh
npm install postcss-loader --save-dev
```

## Usage

Create `postcss.config.js`:

```js
module.exports = {
  plugins: [
    require('postcss-smart-import')({ /* ...options */ }),
    require('precss')({ /* ...options */ }),
    require('autoprefixer')({ /* ...options */ })
  ]
}
```

You could put different configs in different directories. For example,
global config in `project/postcss.config.js` and override its plugins
in `project/src/legacy/postcss.config.js`.

You can read more about common PostCSS config in
[postcss-load-config](https://github.com/michael-ciniawsky/postcss-load-config).

Add PostCSS Loader to `webpack.config.js`. Put it after `css-loader`
and `style-loader`. But before `sass-loader`, if you use it.

### Webpack 2

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader?importLoaders=1',
          'postcss-loader'
        ]
      }
    ]
  }
}
```

### Webpack 1

```js
module.exports = {
  module: {
    loaders: [
      {
        test: /\.css$/,
        loaders: [
          'style-loader',
          'css-loader?importLoaders=1',
          'postcss-loader'
        ]
      }
    ]
  }
}
```

## Options

### Plugins

We recommend to use `postcss.config.js`, but also you can specify plugins
directly in webpack config.

#### Webpack 2

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css/,
        use: [
          …
          {
            loader: 'postcss-loader',
            options: {
              plugins: function () {
                return [
                  require('precss'),
                  require('autoprefixer')
                ];
              }
            }
          }
        ]
      }
    ]
  }
}
```

#### Webpack 1

```js
module.exports = {
  module: {
    loaders: [
      {
        test: /\.css$/,
        loaders: [
          …
          'postcss-loader'
        ]
      }
    ]
  },
  postcss: () => {
    return [
      require('precss'),
      require('autoprefixer')
    ];
  }
}
```

### Syntaxes

PostCSS can transforms styles in any syntax, not only in CSS.
There are 3 parameters to control syntax:

* `syntax` accepts module name with `parse` and `stringify` function.
* `parser` accepts module name with input parser function.
* `stringifier` accepts module name with output stringifier function.

```js
module.exports = {
  module: {
    loaders: [
      {
        test:   /\.sss/,
        loaders: [
          'style-loader',
          'css-loader?importLoaders=1',
          'postcss-loader?parser=sugarss'
        ]
      }
    ]
  }
}
```

### SourceMaps

Loader will use source map settings from previous loader.

You can set this `sourceMap` parameter to `inline` value to put source maps
into CSS annotation comment:

```js
module.exports = {
  module: {
    loaders: [
      {
        test: '\/.css',
        loaders: [
          'style-loader',
          'css-loader?importLoaders=1',
          'postcss-loader?sourceMap=inline'
        ]
      }
    ]
  }
}
```

## Examples

### CSS Modules

This loader [cannot be used] with [CSS Modules] out of the box due
to the way `css-loader` processes file imports. To make them work properly,
either add the css-loader’s [`importLoaders`] option

```js
…
      {
        test: /\.css$/,
        loaders: [
          'style-loader',
          'css-loader?modules&importLoaders=1',
          'postcss-loader'
        ]
      }
…
```
or use [postcss-modules] plugin instead of `css-loader`.


[`importLoaders`]: https://github.com/webpack/css-loader#importing-and-chained-loaders
[postcss-modules]: https://github.com/outpunk/postcss-modules
[cannot be used]: https://github.com/webpack/css-loader/issues/137
[CSS Modules]: https://github.com/webpack/css-loader#css-modules

### JS Styles

If you want to process styles written in JavaScript
you can use the [postcss-js] parser.

```js
…
      {
        test: /\.style.js$/,
        loaders: [
          'style-loader',
          'css-loader?modules&importLoaders=1',
          'postcss-loader?parser=postcss-js',
          'babel'
        ]
      }
…
```

As result you will be able to write styles as:

```js
import colors from './config/colors'

export default {
  '.menu': {
    color: colors.main,
    height: 25,
    '&_link': {
      color: 'white'
    }
  }
}
```

> If you are using Babel >= v6 you need to do the following in order for the setup to work

> 1. Add [babel-plugin-add-module-exports] to your configuration
> 2. You need to have only one **default** export per style module

If you use JS styles without `postcss-js` parser, you can add `exec` parameter:

```js
…
      {
        test:   /\.style.xyz$/,
        loaders: [
          'style-loader',
          'css-loader?modules&importLoaders=1',
          'postcss-loader?parser=custom-parser&exec'
        ]
      }
…
```

[postcss-js]: https://github.com/postcss/postcss-js
[babel-plugin-add-module-exports]: https://github.com/59naga/babel-plugin-add-module-exports

### Dynamic Config

PostCSS loader sends a loaded instance to PostCSS common config.
You can use it to do some real magic:

```js
module.exports = function (ctx) {
    if (check(ctx.webpack.resourcePath)) {
        return { plugins: plugins1 };
    } else {
        return { plugins: plugins2 };
    }
}
```

### Webpack Events

Webpack provides webpack plugin developers a convenient way
to hook into the build pipeline. The postcss-loader makes use
of this event system to allow building integrated postcss-webpack tools.

See the [example] implementation.

Event `postcss-loader-before-processing` is fired before processing and allows
to add or remove postcss plugins.

[example]: https://github.com/postcss/postcss-loader/blob/master/test/webpack-plugins/rewrite.js
