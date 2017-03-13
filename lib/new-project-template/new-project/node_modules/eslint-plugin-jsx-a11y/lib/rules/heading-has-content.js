'use strict';

var _jsxAstUtils = require('jsx-ast-utils');

var _schemas = require('../util/schemas');

var _isHiddenFromScreenReader = require('../util/isHiddenFromScreenReader');

var _isHiddenFromScreenReader2 = _interopRequireDefault(_isHiddenFromScreenReader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var errorMessage = 'Headings must have content and the content must be accessible by a screen reader.'; /**
                                                                                                         * @fileoverview Enforce heading (h1, h2, etc) elements contain accessible content.
                                                                                                         * @author Ethan Cohen
                                                                                                         */

// ----------------------------------------------------------------------------
// Rule Definition
// ----------------------------------------------------------------------------

var headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

var schema = (0, _schemas.generateObjSchema)({ components: _schemas.arraySchema });

var determineChildType = function determineChildType(child) {
  switch (child.type) {
    case 'Literal':
      return Boolean(child.value);
    case 'JSXElement':
      return !(0, _isHiddenFromScreenReader2.default)((0, _jsxAstUtils.elementType)(child.openingElement), child.openingElement.attributes);
    case 'JSXExpressionContainer':
      if (child.expression.type === 'Identifier') {
        return child.expression.name !== 'undefined';
      }
      return true;
    default:
      return false;
  }
};

module.exports = {
  determineChildType: determineChildType,
  meta: {
    docs: {},
    schema: [schema]
  },

  create: function create(context) {
    return {
      JSXOpeningElement: function JSXOpeningElement(node) {
        var typeCheck = headings.concat(context.options[0]);
        var nodeType = (0, _jsxAstUtils.elementType)(node);

        // Only check 'h*' elements and custom types.
        if (typeCheck.indexOf(nodeType) === -1) {
          return;
        }

        var isAccessible = node.parent.children.some(determineChildType) || (0, _jsxAstUtils.hasAnyProp)(node.attributes, ['dangerouslySetInnerHTML', 'children']);

        if (isAccessible) {
          return;
        }

        context.report({
          node: node,
          message: errorMessage
        });
      }
    };
  }
};