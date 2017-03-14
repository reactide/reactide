/**
 * @fileoverview Enforce that elements with onClick handlers must be focusable.
 * @author Ethan Cohen
 */

import { getProp, elementType } from 'jsx-ast-utils';
import { generateObjSchema } from '../util/schemas';
import isHiddenFromScreenReader from '../util/isHiddenFromScreenReader';
import isInteractiveElement from '../util/isInteractiveElement';
import isInteractiveRole from '../util/isInteractiveRole';
import getTabIndex from '../util/getTabIndex';

// ----------------------------------------------------------------------------
// Rule Definition
// ----------------------------------------------------------------------------

const errorMessage =
  'An non-interactive element with an onClick handler and an ' +
  'interactive role must be focusable. Either set the tabIndex property to ' +
  'a valid value (usually 0) or use an element type which is inherently ' +
  'focusable such as `button`.';

const schema = generateObjSchema();

module.exports = {
  meta: {
    docs: {},
    schema: [schema],
  },

  create: context => ({
    JSXOpeningElement: (node) => {
      const { attributes } = node;
      if (getProp(attributes, 'onClick') === undefined) {
        return;
      }

      const type = elementType(node);

      if (isHiddenFromScreenReader(type, attributes)) {
        return;
      } else if (isInteractiveElement(type, attributes)) {
        return;
      } else if (!isInteractiveRole(type, attributes)) {
        // A non-interactive element or an element without an interactive
        // role might have a click hanlder attached to it in order to catch
        // bubbled click events. In this case, the author should apply a role
        // of presentation to the element to indicate that it is not meant to
        // be interactive.
        return;
      } else if (getTabIndex(getProp(attributes, 'tabIndex')) !== undefined) {
        return;
      }

      context.report({
        node,
        message: errorMessage,
      });
    },
  }),
};
