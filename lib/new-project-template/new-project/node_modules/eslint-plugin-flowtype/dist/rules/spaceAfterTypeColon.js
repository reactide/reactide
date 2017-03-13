'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _utilities = require('./../utilities');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var parseOptions = function parseOptions(context) {
  return {
    always: (context.options[0] || 'always') === 'always'
  };
};

var propertyEvaluator = function propertyEvaluator(context, typeForMessage) {
  var _parseOptions = parseOptions(context);

  var always = _parseOptions.always;


  var sourceCode = context.getSourceCode();

  var getSpacesAfterColon = function getSpacesAfterColon(node, typeAnnotation) {
    if (node.type === 'FunctionTypeParam') {
      var colon = sourceCode.getFirstToken(node, node.optional ? 2 : 1);

      return {
        colon: colon,
        spaceAfter: sourceCode.getTokenAfter(colon).start - colon.end
      };
    } else {
      var _sourceCode$getFirstT = sourceCode.getFirstTokens(typeAnnotation, 2);

      var _sourceCode$getFirstT2 = _slicedToArray(_sourceCode$getFirstT, 2);

      var _colon = _sourceCode$getFirstT2[0];
      var token = _sourceCode$getFirstT2[1];


      return {
        colon: _colon,
        spaceAfter: token.start - typeAnnotation.start - 1
      };
    }
  };

  return function (node) {
    var typeAnnotation = _lodash2.default.get(node, 'typeAnnotation') || _lodash2.default.get(node, 'left.typeAnnotation');

    if (typeAnnotation) {
      var _getSpacesAfterColon = getSpacesAfterColon(node, typeAnnotation);

      var colon = _getSpacesAfterColon.colon;
      var spaceAfter = _getSpacesAfterColon.spaceAfter;


      var data = {
        name: (0, _utilities.quoteName)((0, _utilities.getParameterName)(node, context)),
        type: typeForMessage
      };

      if (always && spaceAfter > 1) {
        context.report({
          data: data,
          fix: _utilities.spacingFixers.stripSpacesAfter(colon, spaceAfter - 1),
          message: 'There must be 1 space after {{name}}{{type}} type annotation colon.',
          node: node
        });
      } else if (always && spaceAfter === 0) {
        context.report({
          data: data,
          fix: _utilities.spacingFixers.addSpaceAfter(colon),
          message: 'There must be a space after {{name}}{{type}} type annotation colon.',
          node: node
        });
      } else if (!always && spaceAfter > 0) {
        context.report({
          data: data,
          fix: _utilities.spacingFixers.stripSpacesAfter(colon, spaceAfter),
          message: 'There must be no space after {{name}}{{type}} type annotation colon.',
          node: node
        });
      }
    }
  };
};

var returnTypeEvaluator = function returnTypeEvaluator(context) {
  var _parseOptions2 = parseOptions(context);

  var always = _parseOptions2.always;


  var sourceCode = context.getSourceCode();

  return function (functionNode) {
    // skip FunctionTypeAnnotation, possibly another rule as it's an arrow, not a colon?
    // (foo: number) => string
    //              ^^^^
    if (functionNode.returnType && functionNode.type !== 'FunctionTypeAnnotation') {
      var _sourceCode$getFirstT3 = sourceCode.getFirstTokens(functionNode.returnType, 2);

      var _sourceCode$getFirstT4 = _slicedToArray(_sourceCode$getFirstT3, 2);

      var colon = _sourceCode$getFirstT4[0];
      var token = _sourceCode$getFirstT4[1];

      var spaces = token.start - functionNode.returnType.start - 1;

      if (always && spaces > 1) {
        context.report({
          fix: _utilities.spacingFixers.stripSpacesAfter(colon, spaces - 1),
          message: 'There must be 1 space after return type colon.',
          node: functionNode
        });
      } else if (always && spaces === 0) {
        context.report({
          fix: _utilities.spacingFixers.addSpaceAfter(colon),
          message: 'There must be a space after return type colon.',
          node: functionNode
        });
      } else if (!always && spaces > 0) {
        context.report({
          fix: _utilities.spacingFixers.stripSpacesAfter(colon, spaces),
          message: 'There must be no space after return type colon.',
          node: functionNode
        });
      }
    }
  };
};

var functionEvaluators = (0, _utilities.iterateFunctionNodes)(function (context) {
  var checkParam = propertyEvaluator(context, 'parameter');
  var checkReturnType = returnTypeEvaluator(context);

  return function (functionNode) {
    _lodash2.default.forEach(functionNode.params, checkParam);
    checkReturnType(functionNode);
  };
});

// 1) type X = { foo(): A; }
// 2) type X = { foo: () => A; }
// the above have identical ASTs (save for their ranges)
// case 1 doesn't have a type annotation colon and should be ignored
var isShortPropertyFunction = function isShortPropertyFunction(objectTypeProperty) {
  return objectTypeProperty.value.type === 'FunctionTypeAnnotation' && objectTypeProperty.start === objectTypeProperty.value.start;
};

var objectTypePropertyEvaluator = function objectTypePropertyEvaluator(context) {
  var _parseOptions3 = parseOptions(context);

  var always = _parseOptions3.always;


  var sourceCode = context.getSourceCode();

  var getColon = function getColon(objectTypeProperty) {
    var tokenIndex = 1; // eslint-disable-line init-declarations

    if (objectTypeProperty.optional) {
      tokenIndex++;
    }

    if (objectTypeProperty.static) {
      tokenIndex++;
    }

    if (objectTypeProperty.variance) {
      tokenIndex++;
    }

    return sourceCode.getFirstToken(objectTypeProperty, tokenIndex);
  };

  return function (objectTypeProperty) {
    if (isShortPropertyFunction(objectTypeProperty)) {
      return;
    }

    var colon = getColon(objectTypeProperty);
    var typeAnnotation = sourceCode.getTokenAfter(colon);

    var spaces = typeAnnotation.start - colon.end;

    var data = {
      name: (0, _utilities.quoteName)((0, _utilities.getParameterName)(objectTypeProperty, context))
    };

    if (always && spaces > 1) {
      context.report({
        data: data,
        fix: _utilities.spacingFixers.stripSpacesAfter(colon, spaces - 1),
        message: 'There must be 1 space after {{name}}type annotation colon.',
        node: objectTypeProperty
      });
    } else if (always && spaces === 0) {
      context.report({
        data: data,
        fix: _utilities.spacingFixers.addSpaceAfter(colon),
        message: 'There must be a space after {{name}}type annotation colon.',
        node: objectTypeProperty
      });
    } else if (!always && spaces > 0) {
      context.report({
        data: data,
        fix: _utilities.spacingFixers.stripSpacesAfter(colon, spaces),
        message: 'There must be no space after {{name}}type annotation colon.',
        node: objectTypeProperty
      });
    }
  };
};

var typeCastEvaluator = function typeCastEvaluator(context) {
  var sourceCode = context.getSourceCode();

  var _parseOptions4 = parseOptions(context);

  var always = _parseOptions4.always;


  return function (typeCastExpression) {
    var _sourceCode$getFirstT5 = sourceCode.getFirstTokens(typeCastExpression.typeAnnotation, 2);

    var _sourceCode$getFirstT6 = _slicedToArray(_sourceCode$getFirstT5, 2);

    var firstTokenOfType = _sourceCode$getFirstT6[1];

    var spaces = firstTokenOfType.start - typeCastExpression.typeAnnotation.start - 1;

    if (always && spaces > 1) {
      context.report({
        fix: _utilities.spacingFixers.stripSpacesBefore(firstTokenOfType, spaces - 1),
        message: 'There must be 1 space after type cast colon.',
        node: typeCastExpression
      });
    } else if (always && spaces === 0) {
      context.report({
        fix: _utilities.spacingFixers.addSpaceBefore(firstTokenOfType),
        message: 'There must be a space after type cast colon.',
        node: typeCastExpression
      });
    } else if (!always && spaces > 0) {
      context.report({
        fix: _utilities.spacingFixers.stripSpacesBefore(firstTokenOfType, spaces),
        message: 'There must be no space after type cast colon.',
        node: typeCastExpression
      });
    }
  };
};

exports.default = function (context) {
  return _extends({}, functionEvaluators(context), {
    ClassProperty: propertyEvaluator(context, 'class property'),
    ObjectTypeProperty: objectTypePropertyEvaluator(context),
    TypeCastExpression: typeCastEvaluator(context)
  });
};

module.exports = exports['default'];