'use strict';

var _jsxAstUtils = require('jsx-ast-utils');

var _schemas = require('../util/schemas');

/**
 * @fileoverview Enforce label tags have htmlFor attribute.
 * @author Ethan Cohen
 */

// ----------------------------------------------------------------------------
// Rule Definition
// ----------------------------------------------------------------------------

var errorMessage = 'Form controls using a label to identify them must be ' + 'programmatically associated with the control using htmlFor';

var schema = (0, _schemas.generateObjSchema)({ components: _schemas.arraySchema });

module.exports = {
  meta: {
    docs: {},
    schema: [schema]
  },

  create: function create(context) {
    return {
      JSXOpeningElement: function JSXOpeningElement(node) {
        var options = context.options[0] || {};
        var componentOptions = options.components || [];
        var typesToValidate = ['label'].concat(componentOptions);
        var nodeType = (0, _jsxAstUtils.elementType)(node);

        // Only check 'label' elements and custom types.
        if (typesToValidate.indexOf(nodeType) === -1) {
          return;
        }

        var htmlForAttr = (0, _jsxAstUtils.getProp)(node.attributes, 'htmlFor');
        var htmlForValue = (0, _jsxAstUtils.getPropValue)(htmlForAttr);
        var isInvalid = htmlForAttr === false || !htmlForValue;

        if (isInvalid) {
          context.report({
            node: node,
            message: errorMessage
          });
        }
      }
    };
  }
};