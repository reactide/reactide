'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash/');

var _lodash2 = _interopRequireDefault(_lodash);

var _utilities = require('./../utilities');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (context) {
  var report = function report(node) {
    context.report({
      loc: node.loc,
      message: 'Duplicate property.',
      node: node
    });
  };

  var checkForDuplicates = function checkForDuplicates(node) {
    var haystack = [];

    _lodash2.default.forEach(node.properties, function (identifierNode) {
      var needle = (0, _utilities.getParameterName)(identifierNode, context);

      if (_lodash2.default.includes(haystack, needle)) {
        report(identifierNode);
      } else {
        haystack.push(needle);
      }
    });
  };

  return {
    ObjectTypeAnnotation: checkForDuplicates
  };
};

module.exports = exports['default'];