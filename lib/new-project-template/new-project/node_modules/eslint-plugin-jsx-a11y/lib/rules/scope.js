'use strict';

var _ariaQuery = require('aria-query');

var _jsxAstUtils = require('jsx-ast-utils');

var _schemas = require('../util/schemas');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /**
                                                                                                                                                                                                     * @fileoverview Enforce scope prop is only used on <th> elements.
                                                                                                                                                                                                     * @author Ethan Cohen
                                                                                                                                                                                                     */

// ----------------------------------------------------------------------------
// Rule Definition
// ----------------------------------------------------------------------------

var errorMessage = 'The scope prop can only be used on <th> elements.';

var schema = (0, _schemas.generateObjSchema)();

module.exports = {
  meta: {
    docs: {},
    schema: [schema]
  },

  create: function create(context) {
    return {
      JSXAttribute: function JSXAttribute(node) {
        var name = (0, _jsxAstUtils.propName)(node);
        if (name && name.toUpperCase() !== 'SCOPE') {
          return;
        }

        var parent = node.parent;

        var tagName = (0, _jsxAstUtils.elementType)(parent);

        // Do not test higher level JSX components, as we do not know what
        // low-level DOM element this maps to.
        if ([].concat(_toConsumableArray(_ariaQuery.dom.keys())).indexOf(tagName) === -1) {
          return;
        } else if (tagName && tagName.toUpperCase() === 'TH') {
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