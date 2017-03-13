'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _utilities = require('./../utilities');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _utilities.iterateFunctionNodes)(function (context) {
  var checkThisFile = !_lodash2.default.get(context, 'settings.flowtype.onlyFilesWithFlowAnnotation') || (0, _utilities.isFlowFile)(context);

  if (!checkThisFile) {
    return function () {};
  }

  var skipArrows = _lodash2.default.get(context, 'options[0].excludeArrowFunctions');

  return function (functionNode) {
    _lodash2.default.forEach(functionNode.params, function (identifierNode) {
      var typeAnnotation = _lodash2.default.get(identifierNode, 'typeAnnotation') || _lodash2.default.get(identifierNode, 'left.typeAnnotation');

      var isArrow = functionNode.type === 'ArrowFunctionExpression';
      var isArrowFunctionExpression = functionNode.expression;

      if (skipArrows === 'expressionsOnly' && isArrowFunctionExpression || skipArrows === true && isArrow) {
        return;
      }

      if (!typeAnnotation) {
        context.report({
          data: {
            name: (0, _utilities.quoteName)((0, _utilities.getParameterName)(identifierNode, context))
          },
          message: 'Missing {{name}}parameter type annotation.',
          node: identifierNode
        });
      }
    });
  };
});
module.exports = exports['default'];