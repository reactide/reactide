'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _utilities = require('./../utilities');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (context) {
  var checkThisFile = !_lodash2.default.get(context, 'settings.flowtype.onlyFilesWithFlowAnnotation') || (0, _utilities.isFlowFile)(context);

  if (!checkThisFile) {
    return function () {};
  }

  var annotateReturn = (_lodash2.default.get(context, 'options[0]') || 'always') === 'always';
  var annotateUndefined = (_lodash2.default.get(context, 'options[1].annotateUndefined') || 'never') === 'always';
  var skipArrows = _lodash2.default.get(context, 'options[1].excludeArrowFunctions') || false;

  var targetNodes = [];

  var registerFunction = function registerFunction(functionNode) {
    targetNodes.push({
      functionNode: functionNode
    });
  };

  var isUndefinedReturnType = function isUndefinedReturnType(returnNode) {
    return returnNode.argument === null || returnNode.argument.name === 'undefined' || returnNode.argument.operator === 'void';
  };

  var getIsReturnTypeAnnotationUndefined = function getIsReturnTypeAnnotationUndefined(targetNode) {
    var isReturnTypeAnnotationLiteralUndefined = _lodash2.default.get(targetNode, 'functionNode.returnType.typeAnnotation.id.name') === 'undefined' && _lodash2.default.get(targetNode, 'functionNode.returnType.typeAnnotation.type') === 'GenericTypeAnnotation';
    var isReturnTypeAnnotationVoid = _lodash2.default.get(targetNode, 'functionNode.returnType.typeAnnotation.type') === 'VoidTypeAnnotation';

    return isReturnTypeAnnotationLiteralUndefined || isReturnTypeAnnotationVoid;
  };

  var evaluateFunction = function evaluateFunction(functionNode) {
    var targetNode = targetNodes.pop();

    if (functionNode !== targetNode.functionNode) {
      throw new Error('Mismatch.');
    }

    var isArrow = functionNode.type === 'ArrowFunctionExpression';
    var isArrowFunctionExpression = functionNode.expression;
    var hasImplicitReturnType = functionNode.async || functionNode.generator;
    var isFunctionReturnUndefined = !isArrowFunctionExpression && !hasImplicitReturnType && (!targetNode.returnStatementNode || isUndefinedReturnType(targetNode.returnStatementNode));
    var isReturnTypeAnnotationUndefined = getIsReturnTypeAnnotationUndefined(targetNode);

    if (skipArrows === 'expressionsOnly' && isArrowFunctionExpression || skipArrows === true && isArrow) {
      return;
    }

    if (isFunctionReturnUndefined && isReturnTypeAnnotationUndefined && !annotateUndefined) {
      context.report(functionNode, 'Must not annotate undefined return type.');
    } else if (isFunctionReturnUndefined && !isReturnTypeAnnotationUndefined && annotateUndefined) {
      context.report(functionNode, 'Must annotate undefined return type.');
    } else if (!isFunctionReturnUndefined && !isReturnTypeAnnotationUndefined) {
      if (annotateReturn && !functionNode.returnType) {
        context.report(functionNode, 'Missing return type annotation.');
      }
    }
  };

  var evaluateNoise = function evaluateNoise() {
    targetNodes.pop();
  };

  return {
    ArrowFunctionExpression: registerFunction,
    'ArrowFunctionExpression:exit': evaluateFunction,
    ClassDeclaration: registerFunction,
    'ClassDeclaration:exit': evaluateNoise,
    ClassExpression: registerFunction,
    'ClassExpression:exit': evaluateNoise,
    FunctionDeclaration: registerFunction,
    'FunctionDeclaration:exit': evaluateFunction,
    FunctionExpression: registerFunction,
    'FunctionExpression:exit': evaluateFunction,
    ReturnStatement: function ReturnStatement(node) {
      targetNodes[targetNodes.length - 1].returnStatementNode = node;
    }
  };
};

module.exports = exports['default'];