# Electron-to-Chromium
This repository provides a mapping of Electron versions to the Chromium version that it uses.

This package is used in [Browserslist](https://github.com/ai/browserslist), so you can use e.g. `electron >= 1.4` in [Autoprefixer](https://github.com/postcss/autoprefixer), [Stylelint](https://github.com/stylelint/stylelint), [babel-present-env](https://github.com/babel/babel-preset-env) and [eslint-plugin-compat](https://github.com/amilajack/eslint-plugin-compat).

## Install
Install using `npm install electron-to-chromium`.

## Usage
to include electron-to-chromium, require it:

```js
var e2c = require('electron-to-chromium');
```

### Properties
The Electron-to-Chromium object has 4 properties to use:

#### versions
An object with all _major_ Electron versions as keys and their respective major Chromium version as string value.

```js
var versions = e2c.versions;
console.log(versions['1.4']);
// returns "53"
```

#### fullVersions
An object with all Electron versions as keys and their respective Chromium version as value.

```js
var versions = e2c.fullVersions;
console.log(versions['1.4.11']);
// returns "53.0.2785.143"
```

#### electronToChromium(query)
Arguments:
* Query: string or number, required. A major or full electron version.

A function that returns the corresponding Chromium version for a given Electron function. Returns a string.

If you provide it with a major Electron version, it will return a major Chromium version:

```js
var chromeVersion = e2c.electronToChromium('1.4');
// chromeVersion is "53"
```

If you provide it with a full Electron version, it will return the full Chromium version.

```js
var chromeVersion = e2c.electronToChromium('1.4.11');
// chromeVersion is "53.0.2785.143"
```

If a query does not match a Chromium version, it will return `undefined`.

```js
var chromeVersion = e2c.electronToChromium('9000');
// chromeVersion is undefined
```

#### electronToBrowserList(query) **DEPRECATED**
Arguments:
* Query: string or number, required. A major Electron version.

_**Deprecated**: Browserlist already includes electron-to-chromium._

A function that returns a [Browserlist](https://github.com/ai/browserslist) query that matches the given major Electron version. Returns a string.

If you provide it with a major Electron version, it will return a Browserlist query string that matches the chromium capabilities:

```js
var query = e2c.electronToBrowserList('1.4');
// query is "Chrome >= 53"
```

If a query does not match a Chromium version, it will return `undefined`.

```js
var query = e2c.electronToBrowserList('9000');
// query is undefined
```

### importing just versions or fullVersions
Both the versions and the fullVersions list can be imported on their own, if file-size is a concern.

### versions

```js
var versions = require('electron-to-chromium/versions');
```

### fullVersions

```js
var fullVersions = require('electron-to-chromium/full-versions');
```


## Updating
This package will be updated with each new Electron release.

To update the list, run `npm run build.js`. Requires internet access as it downloads from the canonical list of Electron versions.
