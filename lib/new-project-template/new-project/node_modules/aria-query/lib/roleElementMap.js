'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _rolesMap = require('./rolesMap');

var _rolesMap2 = _interopRequireDefault(_rolesMap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// $FlowFixMe: spread operand is valid on $Iterable
var roleElementMap = [].concat(_toConsumableArray(_rolesMap2.default.keys())).reduce(function (accumulator, key) {
  var role = _rolesMap2.default.get(key);
  if (role) {
    [].concat(_toConsumableArray(role.baseConcepts), _toConsumableArray(role.relatedConcepts)).forEach(function (relation) {
      if (relation.module === 'HTML') {
        var concept = relation.concept;
        var relationConcepts = accumulator.get(key) || new Set([]);
        relationConcepts.add(JSON.stringify(concept));
        accumulator.set(key, relationConcepts);
      }
    });
  }
  return accumulator;
}, new Map([]));

exports.default = roleElementMap;