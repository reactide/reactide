import { dom } from 'aria-query';
import { getProp, getPropValue, getLiteralPropValue } from 'jsx-ast-utils';
import getTabIndex from './getTabIndex';

// Map of tagNames to functions that return whether that element is interactive or not.
const DOMElements = [...dom.keys()];
const pureInteractiveElements = DOMElements
  .filter(name => dom.get(name).interactive === true)
  .reduce((accumulator, name) => {
    const interactiveElements = accumulator;
    interactiveElements[name] = () => true;
    return interactiveElements;
  }, {});

const isLink = function isLink(attributes) {
  const href = getPropValue(getProp(attributes, 'href'));
  const tabIndex = getTabIndex(getProp(attributes, 'tabIndex'));
  return href !== undefined || tabIndex !== undefined;
};

export const interactiveElementsMap = {
  ...pureInteractiveElements,
  a: isLink,
  area: isLink,
  input: (attributes) => {
    const typeAttr = getLiteralPropValue(getProp(attributes, 'type'));
    return typeAttr ? typeAttr.toUpperCase() !== 'HIDDEN' : true;
  },
};

/**
 * Returns boolean indicating whether the given element is
 * interactive on the DOM or not. Usually used when an element
 * has a dynamic handler on it and we need to discern whether or not
 * it's intention is to be interacted with on the DOM.
 */
const isInteractiveElement = (tagName, attributes) => {
  // Do not test higher level JSX components, as we do not know what
  // low-level DOM element this maps to.
  if (DOMElements.indexOf(tagName) === -1) {
    return true;
  }

  if ({}.hasOwnProperty.call(interactiveElementsMap, tagName) === false) {
    return false;
  }

  return interactiveElementsMap[tagName](attributes);
};

export default isInteractiveElement;
