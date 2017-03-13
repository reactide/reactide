# node-stream-cache

A simple way to cache and replay readable streams.

## Usage

```js
var StreamCache = require('stream-cache');
var fs          = require('fs');

var cache = new StreamCache();
fs.createReadStream(__filename).pipe(cache);

// Cache can now be piped anywhere, even before the readable stream finishes.
cache.pipe(process.stdout);
```
