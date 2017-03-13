'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dom = require('./etc/dom.json');

var _dom2 = _interopRequireDefault(_dom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var domMap = new Map([]);

Object.keys(_dom2.default).reduce(function (map, key) {
  return map.set(key, _dom2.default[key]);
}, domMap);

exports.default = domMap;