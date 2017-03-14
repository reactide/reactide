'use strict';

var _jsxAstUtils = require('jsx-ast-utils');

var _schemas = require('../util/schemas');

/**
 * @fileoverview Enforce img tag uses alt attribute.
 * @author Ethan Cohen
 */

// ----------------------------------------------------------------------------
// Rule Definition
// ----------------------------------------------------------------------------

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
        var typesToValidate = ['img'].concat(componentOptions);
        var nodeType = (0, _jsxAstUtils.elementType)(node);

        // Only check 'img' elements and custom types.
        if (typesToValidate.indexOf(nodeType) === -1) {
          return;
        }

        var roleProp = (0, _jsxAstUtils.getProp)(node.attributes, 'role');
        var roleValue = (0, _jsxAstUtils.getPropValue)(roleProp);
        var isPresentation = roleProp && typeof roleValue === 'string' && roleValue.toLowerCase() === 'presentation';

        var altProp = (0, _jsxAstUtils.getProp)(node.attributes, 'alt');

        // Missing alt prop error.
        if (altProp === undefined) {
          if (isPresentation) {
            context.report({
              node: node,
              message: 'Prefer alt="" over role="presentation". First rule of aria is to not use aria if it can be achieved via native HTML.'
            });
            return;
          }
          context.report({
            node: node,
            message: nodeType + ' elements must have an alt prop, either with meaningful text, or an empty string for decorative images.'
          });
          return;
        }

        // Check if alt prop is undefined.
        var altValue = (0, _jsxAstUtils.getPropValue)(altProp);
        var isNullValued = altProp.value === null; // <img alt />

        if (altValue && !isNullValued || altValue === '') {
          return;
        }

        // Undefined alt prop error.
        context.report({
          node: node,
          message: 'Invalid alt value for ' + nodeType + '. Use alt="" for presentational images.'
        });
      }
    };
  }
};