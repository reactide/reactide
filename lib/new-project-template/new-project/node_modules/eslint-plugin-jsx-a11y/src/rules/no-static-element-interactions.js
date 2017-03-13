/**
 * @fileoverview Enforce non-interactive elements have no interactive handlers.
 * @author Ethan Cohen
 */

// ----------------------------------------------------------------------------
// Rule Definition
// ----------------------------------------------------------------------------

import { hasAnyProp, elementType } from 'jsx-ast-utils';
import { generateObjSchema } from '../util/schemas';
import isHiddenFromScreenReader from '../util/isHiddenFromScreenReader';
import isInteractiveElement from '../util/isInteractiveElement';

const errorMessage =
  'Visible, non-interactive elements should not have mouse or keyboard event listeners';

const schema = generateObjSchema();

module.exports = {
  meta: {
    docs: {},
    schema: [schema],
  },

  create: context => ({
    JSXOpeningElement: (node) => {
      const props = node.attributes;
      const type = elementType(node);

      const interactiveProps = [
        'onclick',
        'ondblclick',
        'onkeydown',
        'onkeyup',
        'onkeypress',
      ];

      if (isHiddenFromScreenReader(type, props)) {
        return;
      } else if (isInteractiveElement(type, props)) {
        return;
      } else if (hasAnyProp(props, interactiveProps) === false) {
        return;
      }

      // Visible, non-interactive elements should not have an interactive handler.
      context.report({
        node,
        message: errorMessage,
      });
    },
  }),
};
