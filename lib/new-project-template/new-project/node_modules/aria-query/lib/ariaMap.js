'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _aria = require('./etc/aria.json');

var _aria2 = _interopRequireDefault(_aria);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ariaMap = new Map([]);

Object.keys(_aria2.default).reduce(function (map, key) {
  return map.set(key, _aria2.default[key]);
}, ariaMap);

exports.default = ariaMap;