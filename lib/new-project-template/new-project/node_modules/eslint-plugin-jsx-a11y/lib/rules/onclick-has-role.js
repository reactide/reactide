'use strict';

var _jsxAstUtils = require('jsx-ast-utils');

var _schemas = require('../util/schemas');

var _isHiddenFromScreenReader = require('../util/isHiddenFromScreenReader');

var _isHiddenFromScreenReader2 = _interopRequireDefault(_isHiddenFromScreenReader);

var _isInteractiveElement = require('../util/isInteractiveElement');

var _isInteractiveElement2 = _interopRequireDefault(_isInteractiveElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ----------------------------------------------------------------------------
// Rule Definition
// ----------------------------------------------------------------------------

/**
 * @fileoverview Enforce non-interactive elements with
 *  click handlers use role attribute.
 * @author Ethan Cohen
 */

var errorMessage = 'Visible, non-interactive elements with click handlers must ' + 'have role attribute.';

var schema = (0, _schemas.generateObjSchema)();

module.exports = {
  meta: {
    docs: {},
    schema: [schema]
  },

  create: function create(context) {
    return {
      JSXOpeningElement: function JSXOpeningElement(node) {
        var attributes = node.attributes;
        if ((0, _jsxAstUtils.getProp)(attributes, 'onclick') === undefined) {
          return;
        }

        var type = (0, _jsxAstUtils.elementType)(node);

        if ((0, _isHiddenFromScreenReader2.default)(type, attributes)) {
          return;
        } else if ((0, _isInteractiveElement2.default)(type, attributes)) {
          return;
        } else if ((0, _jsxAstUtils.getPropValue)((0, _jsxAstUtils.getProp)(attributes, 'role'))) {
          return;
        }

        // Visible, non-interactive elements require role attribute.
        context.report({
          node: node,
          message: errorMessage
        });
      }
    };
  }
};