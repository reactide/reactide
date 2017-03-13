'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _roles = require('./etc/roles.json');

var _roles2 = _interopRequireDefault(_roles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rolesMap = new Map([]);

Object.keys(_roles2.default).reduce(function (map, key) {
  return map.set(key, _roles2.default[key]);
}, rolesMap);

exports.default = rolesMap;