/**
 * @fileoverview Enforce label tags have htmlFor attribute.
 * @author Ethan Cohen
 */

// ----------------------------------------------------------------------------
// Rule Definition
// ----------------------------------------------------------------------------

import { getProp, getPropValue, elementType } from 'jsx-ast-utils';
import { generateObjSchema, arraySchema } from '../util/schemas';

const errorMessage = 'Form controls using a label to identify them must be ' +
  'programmatically associated with the control using htmlFor';

const schema = generateObjSchema({ components: arraySchema });

module.exports = {
  meta: {
    docs: {},
    schema: [schema],
  },

  create: context => ({
    JSXOpeningElement: (node) => {
      const options = context.options[0] || {};
      const componentOptions = options.components || [];
      const typesToValidate = ['label'].concat(componentOptions);
      const nodeType = elementType(node);

      // Only check 'label' elements and custom types.
      if (typesToValidate.indexOf(nodeType) === -1) {
        return;
      }

      const htmlForAttr = getProp(node.attributes, 'htmlFor');
      const htmlForValue = getPropValue(htmlForAttr);
      const isInvalid = htmlForAttr === false || !htmlForValue;

      if (isInvalid) {
        context.report({
          node,
          message: errorMessage,
        });
      }
    },
  }),
};
