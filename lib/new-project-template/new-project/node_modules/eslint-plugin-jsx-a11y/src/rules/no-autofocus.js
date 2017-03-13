/**
 * @fileoverview Enforce autoFocus prop is not used.
 * @author Ethan Cohen <@evcohen>
 */

// ----------------------------------------------------------------------------
// Rule Definition
// ----------------------------------------------------------------------------

import { propName } from 'jsx-ast-utils';
import { generateObjSchema } from '../util/schemas';

const errorMessage = 'The autoFocus prop should not be used, as it can reduce usability and accessibility for users.';

const schema = generateObjSchema();

module.exports = {
  meta: {
    docs: {},
    schema: [schema],
  },

  create: context => ({
    JSXAttribute: (attribute) => {
      // Don't normalize, since React only recognizes autoFocus on low-level DOM elements.
      if (propName(attribute) === 'autoFocus') {
        context.report({
          node: attribute,
          message: errorMessage,
        });
      }
    },
  }),
};
