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
    always: context.options[0] === 'always'
  };
};

var propertyEvaluator = function propertyEvaluator(context, typeForMessage) {
  var _parseOptions = parseOptions(context);

  var always = _parseOptions.always;


  var sourceCode = context.getSourceCode();

  var getSpacesBeforeColon = function getSpacesBeforeColon(node, typeAnnotation) {
    if (node.type === 'FunctionTypeParam') {
      // the colon isn't included in the typeAnnotation node here...
      var colon = sourceCode.getTokenBefore(typeAnnotation);
      var tokenBeforeColon = sourceCode.getTokenBefore(colon);

      return {
        spaces: colon.start - tokenBeforeColon.end,
        tokenBeforeType: tokenBeforeColon
      };
    } else {
      // tokenBeforeColon can be the identifier or the closing } token of a destructuring
      var _tokenBeforeColon = sourceCode.getTokenBefore(typeAnnotation);

      return {
        spaces: typeAnnotation.start - _tokenBeforeColon.end,
        tokenBeforeType: _tokenBeforeColon
      };
    }
  };

  return function (node) {
    var typeAnnotation = _lodash2.default.get(node, 'typeAnnotation') || _lodash2.default.get(node, 'left.typeAnnotation');

    if (typeAnnotation) {
      // tokenBeforeType can be the identifier or the closing } token of a destructuring
      var _getSpacesBeforeColon = getSpacesBeforeColon(node, typeAnnotation);

      var spaces = _getSpacesBeforeColon.spaces;
      var tokenBeforeType = _getSpacesBeforeColon.tokenBeforeType;


      var data = {
        name: (0, _utilities.quoteName)((0, _utilities.getParameterName)(node, context)),
        type: typeForMessage
      };

      if (always && spaces > 1) {
        context.report({
          data: data,
          fix: _utilities.spacingFixers.stripSpacesAfter(tokenBeforeType, spaces - 1),
          message: 'There must be 1 space before {{name}}{{type}} type annotation colon.',
          node: node
        });
      } else if (always && spaces === 0) {
        context.report({
          data: data,
          fix: _utilities.spacingFixers.addSpaceAfter(tokenBeforeType),
          message: 'There must be a space before {{name}}{{type}} type annotation colon.',
          node: node
        });
      } else if (!always && spaces > 0) {
        context.report({
          data: data,
          fix: _utilities.spacingFixers.stripSpacesAfter(tokenBeforeType, spaces),
          message: 'There must be no space before {{name}}{{type}} type annotation colon.',
          node: node
        });
      }
    }
  };
};

var functionEvaluators = (0, _utilities.iterateFunctionNodes)(function (context) {
  var checkParam = propertyEvaluator(context, 'parameter');

  return function (functionNode) {
    _lodash2.default.forEach(functionNode.params, checkParam);
  };
});

var objectTypePropertyEvaluator = function objectTypePropertyEvaluator(context) {
  var _parseOptions2 = parseOptions(context);

  var always = _parseOptions2.always;


  var sourceCode = context.getSourceCode();

  var getFirstTokens = function getFirstTokens(objectTypeProperty) {
    var tokens = sourceCode.getFirstTokens(objectTypeProperty, 4);

    var tokenIndex = 0; // eslint-disable-line init-declarations

    if (objectTypeProperty.optional) {
      tokenIndex++;
    }

    if (objectTypeProperty.static) {
      tokenIndex++;
    }

    if (objectTypeProperty.variance) {
      tokenIndex++;
    }

    return [tokens[tokenIndex], tokens[tokenIndex + 1]];
  };

  return function (objectTypeProperty) {
    // tokenBeforeColon can be identifier, or a ? token if is optional
    var _getFirstTokens = getFirstTokens(objectTypeProperty);

    var _getFirstTokens2 = _slicedToArray(_getFirstTokens, 2);

    var tokenBeforeColon = _getFirstTokens2[0];
    var colon = _getFirstTokens2[1];

    var spaces = colon.start - tokenBeforeColon.end;

    var data = {
      name: (0, _utilities.quoteName)((0, _utilities.getParameterName)(objectTypeProperty, context))
    };

    if (always && spaces > 1) {
      context.report({
        data: data,
        fix: _utilities.spacingFixers.stripSpacesAfter(tokenBeforeColon, spaces - 1),
        message: 'There must be 1 space before {{name}}type annotation colon.',
        node: objectTypeProperty
      });
    } else if (always && spaces === 0) {
      context.report({
        data: data,
        fix: _utilities.spacingFixers.addSpaceAfter(tokenBeforeColon),
        message: 'There must be a space before {{name}}type annotation colon.',
        node: objectTypeProperty
      });
    } else if (!always && spaces > 0) {
      context.report({
        data: data,
        fix: _utilities.spacingFixers.stripSpacesAfter(tokenBeforeColon, spaces),
        message: 'There must be no space before {{name}}type annotation colon.',
        node: objectTypeProperty
      });
    }
  };
};

var typeCastEvaluator = function typeCastEvaluator(context) {
  var sourceCode = context.getSourceCode();

  var _parseOptions3 = parseOptions(context);

  var always = _parseOptions3.always;


  return function (typeCastExpression) {
    var lastTokenOfIdentifier = sourceCode.getTokenBefore(typeCastExpression.typeAnnotation);
    var spaces = typeCastExpression.typeAnnotation.start - lastTokenOfIdentifier.end;

    if (always && spaces > 1) {
      context.report({
        fix: _utilities.spacingFixers.stripSpacesAfter(lastTokenOfIdentifier, spaces - 1),
        message: 'There must be 1 space before type cast colon.',
        node: typeCastExpression
      });
    } else if (always && spaces === 0) {
      context.report({
        fix: _utilities.spacingFixers.addSpaceAfter(lastTokenOfIdentifier),
        message: 'There must be a space before type cast colon.',
        node: typeCastExpression
      });
    } else if (!always && spaces > 0) {
      context.report({
        fix: _utilities.spacingFixers.stripSpacesAfter(lastTokenOfIdentifier, spaces),
        message: 'There must be no space before type cast colon.',
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