'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.interactiveElementsMap = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _ariaQuery = require('aria-query');

var _jsxAstUtils = require('jsx-ast-utils');

var _getTabIndex = require('./getTabIndex');

var _getTabIndex2 = _interopRequireDefault(_getTabIndex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// Map of tagNames to functions that return whether that element is interactive or not.
var DOMElements = [].concat(_toConsumableArray(_ariaQuery.dom.keys()));
var pureInteractiveElements = DOMElements.filter(function (name) {
  return _ariaQuery.dom.get(name).interactive === true;
}).reduce(function (accumulator, name) {
  var interactiveElements = accumulator;
  interactiveElements[name] = function () {
    return true;
  };
  return interactiveElements;
}, {});

var isLink = function isLink(attributes) {
  var href = (0, _jsxAstUtils.getPropValue)((0, _jsxAstUtils.getProp)(attributes, 'href'));
  var tabIndex = (0, _getTabIndex2.default)((0, _jsxAstUtils.getProp)(attributes, 'tabIndex'));
  return href !== undefined || tabIndex !== undefined;
};

var interactiveElementsMap = exports.interactiveElementsMap = _extends({}, pureInteractiveElements, {
  a: isLink,
  area: isLink,
  input: function input(attributes) {
    var typeAttr = (0, _jsxAstUtils.getLiteralPropValue)((0, _jsxAstUtils.getProp)(attributes, 'type'));
    return typeAttr ? typeAttr.toUpperCase() !== 'HIDDEN' : true;
  }
});

/**
 * Returns boolean indicating whether the given element is
 * interactive on the DOM or not. Usually used when an element
 * has a dynamic handler on it and we need to discern whether or not
 * it's intention is to be interacted with on the DOM.
 */
var isInteractiveElement = function isInteractiveElement(tagName, attributes) {
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

exports.default = isInteractiveElement;