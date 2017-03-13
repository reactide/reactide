'use strict';

var _jsxAstUtils = require('jsx-ast-utils');

var _schemas = require('../util/schemas');

/**
 * @fileoverview Enforce autoFocus prop is not used.
 * @author Ethan Cohen <@evcohen>
 */

// ----------------------------------------------------------------------------
// Rule Definition
// ----------------------------------------------------------------------------

var errorMessage = 'The autoFocus prop should not be used, as it can reduce usability and accessibility for users.';

var schema = (0, _schemas.generateObjSchema)();

module.exports = {
  meta: {
    docs: {},
    schema: [schema]
  },

  create: function create(context) {
    return {
      JSXAttribute: function JSXAttribute(attribute) {
        // Don't normalize, since React only recognizes autoFocus on low-level DOM elements.
        if ((0, _jsxAstUtils.propName)(attribute) === 'autoFocus') {
          context.report({
            node: attribute,
            message: errorMessage
          });
        }
      }
    };
  }
};