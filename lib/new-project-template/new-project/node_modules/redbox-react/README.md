# redbox-react

[![Build Status](https://travis-ci.org/commissure/redbox-react.svg?branch=master)](https://travis-ci.org/commissure/redbox-react)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

The red box (aka red screen of death) renders an error in this “pretty” format:

<img src="http://i.imgur.com/9Jhlibk.png" alt="red screen of death" width="700" />

## Usage

Catch an error and give it to `redbox-react`. Works great with

- [react-transform-catch-errors]
  - [Example][react-transform-example]
  - [react-transform-boilerplate]
- [react-hot-loader]
  - :warning: ️ based on `3.0.0-beta.2`! This depends on `ErrorBoundaries` which
    will likely not land in react! You should probably not use this
    before 3.0.0 comes out.
  - [Example][react-hot-loader-example]

[react-transform-catch-errors]: https://github.com/gaearon/react-transform-catch-errors
[react-transform-example]: https://github.com/commissure/redbox-react/tree/master/examples/react-transform-catch-errors
[react-transform-boilerplate]: https://github.com/gaearon/react-transform-boilerplate/
[react-hot-loader]: https://github.com/gaearon/react-hot-loader
[react-hot-loader-example]: https://github.com/commissure/redbox-react/tree/master/examples/react-hot-loader

or manually:

```javascript
import RedBox from 'redbox-react'

const e = new Error('boom')
const box = <RedBox error={e} />
```

Here is a more useful, full-fleged example:

```javascript
/* global __DEV__ */
import React from 'react'
import { render } from 'react-dom'
import App from './components/App'

const root = document.getElementById('root')

if (__DEV__) {
  const RedBox = require('redbox-react').default
  try {
    render(<App />, root)
  } catch (e) {
    render(<RedBox error={e} />, root)
  }
} else {
  render(<App />, root)
}
```

## What Is This Good For?

An error that's only in the console is only half the fun. Now you can
use all the wasted space where your app would be if it didn’t crash to
display the error that made it crash.

**Please use this in development only.**

## Will this catch errors for me?
No. This is only a UI component for rendering errors and their stack
traces. It is intended to be used with with other existing solutions
that automate the error catching for you. See the list at the top of
this document or take a look at the [examples].

  [examples]: https://github.com/commissure/redbox-react/tree/master/examples

## Optional Props

The `RedBox` component takes a couple of props that you can use to
customize its behaviour:

### `editorScheme` `[?string]`
If a filename in the stack trace is local, the component can create the
link to open your editor using this scheme eg: `subl` to create
`subl://open?url=file:///filename`.

### `useLines` `[boolean=true]`
Line numbers in the stack trace may be unreliable depending on the
type of sourcemaps. You can choose to not display them with this flag.

### `useColumns` `[boolean=true]`
Column numbers in the stack trace may be unreliable depending on the
type of sourcemaps. You can choose to not display them with this flag.

### `style` `[?object]`
Allows you to override the styles used when rendering the various parts of the
component. It will be shallow-merged with the [default styles](./src/style.js).

If you’re using [react-transform-catch-errors] you can add these
options to your `.babelrc` through the [`imports` property][imports].

  [imports]: https://github.com/gaearon/react-transform-catch-errors#installation

## Sourcemaps With Webpack

If you’re using [Webpack](https://webpack.github.io) you can get
accurate filenames in the stacktrace by setting the
`output.devtoolModuleFilenameTemplate` settings to `/[absolute-resource-path]`.

It's recommended to set the `devtool` setting to `'eval'`.
