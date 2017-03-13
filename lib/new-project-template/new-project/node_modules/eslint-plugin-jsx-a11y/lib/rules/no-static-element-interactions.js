'use strict';

var _jsxAstUtils = require('jsx-ast-utils');

var _schemas = require('../util/schemas');

var _isHiddenFromScreenReader = require('../util/isHiddenFromScreenReader');

var _isHiddenFromScreenReader2 = _interopRequireDefault(_isHiddenFromScreenReader);

var _isInteractiveElement = require('../util/isInteractiveElement');

var _isInteractiveElement2 = _interopRequireDefault(_isInteractiveElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @fileoverview Enforce non-interactive elements have no interactive handlers.
 * @author Ethan Cohen
 */

// ----------------------------------------------------------------------------
// Rule Definition
// ----------------------------------------------------------------------------

var errorMessage = 'Visible, non-interactive elements should not have mouse or keyboard event listeners';

var schema = (0, _schemas.generateObjSchema)();

module.exports = {
  meta: {
    docs: {},
    schema: [schema]
  },

  create: function create(context) {
    return {
      JSXOpeningElement: function JSXOpeningElement(node) {
        var props = node.attributes;
        var type = (0, _jsxAstUtils.elementType)(node);

        var interactiveProps = ['onclick', 'ondblclick', 'onkeydown', 'onkeyup', 'onkeypress'];

        if ((0, _isHiddenFromScreenReader2.default)(type, props)) {
          return;
        } else if ((0, _isInteractiveElement2.default)(type, props)) {
          return;
        } else if ((0, _jsxAstUtils.hasAnyProp)(props, interactiveProps) === false) {
          return;
        }

        // Visible, non-interactive elements should not have an interactive handler.
        context.report({
          node: node,
          message: errorMessage
        });
      }
    };
  }
};