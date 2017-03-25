'use strict';

var _require = require('source-map');

var SourceMapGenerator = _require.SourceMapGenerator;


function makeIdentitySourceMap(content, resourcePath) {
  var map = new SourceMapGenerator();
  map.setSourceContent(resourcePath, content);

  content.split('\n').forEach(function (line, index) {
    map.addMapping({
      source: resourcePath,
      original: {
        line: index + 1,
        column: 0
      },
      generated: {
        line: index + 1,
        column: 0
      }
    });
  });

  return map.toJSON();
}

module.exports = makeIdentitySourceMap;