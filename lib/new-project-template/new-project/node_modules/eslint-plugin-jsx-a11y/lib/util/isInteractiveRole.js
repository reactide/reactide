'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ariaQuery = require('aria-query');

var _jsxAstUtils = require('jsx-ast-utils');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var VALID_ROLES = [].concat(_toConsumableArray(_ariaQuery.roles.keys())).filter(function (role) {
  return _ariaQuery.roles.get(role).interactive === true;
});
/**
 * Returns boolean indicating whether the given element has a role
 * that is associated with an interactive component. Used when an element
 * has a dynamic handler on it and we need to discern whether or not
 * its intention is to be interacted with in the DOM.
 *
 * isInteractiveRole is a Logical Disjunction:
 * https://en.wikipedia.org/wiki/Logical_disjunction
 * The JSX element does not have a tagName or it has a tagName and a role
 * attribute with a value in the set of non-interactive roles.
 */
var isInteractiveRole = function isInteractiveRole(tagName, attributes) {
  // Do not test higher level JSX components, as we do not know what
  // low-level DOM element this maps to.
  if ([].concat(_toConsumableArray(_ariaQuery.dom.keys())).indexOf(tagName) === -1) {
    return true;
  }

  var value = (0, _jsxAstUtils.getLiteralPropValue)((0, _jsxAstUtils.getProp)(attributes, 'role'));

  // If value is undefined, then the role attribute will be dropped in the DOM.
  // If value is null, then getLiteralAttributeValue is telling us that the
  // value isn't in the form of a literal
  if (value === undefined || value === null) {
    return false;
  }

  var normalizedValues = String(value).toLowerCase().split(' ');
  var isInteractive = normalizedValues.every(function (val) {
    return VALID_ROLES.indexOf(val) > -1;
  });

  return isInteractive;
};

exports.default = isInteractiveRole;