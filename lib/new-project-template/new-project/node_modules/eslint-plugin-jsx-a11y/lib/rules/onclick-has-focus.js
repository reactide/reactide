'use strict';

var _jsxAstUtils = require('jsx-ast-utils');

var _schemas = require('../util/schemas');

var _isHiddenFromScreenReader = require('../util/isHiddenFromScreenReader');

var _isHiddenFromScreenReader2 = _interopRequireDefault(_isHiddenFromScreenReader);

var _isInteractiveElement = require('../util/isInteractiveElement');

var _isInteractiveElement2 = _interopRequireDefault(_isInteractiveElement);

var _isInteractiveRole = require('../util/isInteractiveRole');

var _isInteractiveRole2 = _interopRequireDefault(_isInteractiveRole);

var _getTabIndex = require('../util/getTabIndex');

var _getTabIndex2 = _interopRequireDefault(_getTabIndex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ----------------------------------------------------------------------------
// Rule Definition
// ----------------------------------------------------------------------------

/**
 * @fileoverview Enforce that elements with onClick handlers must be focusable.
 * @author Ethan Cohen
 */

var errorMessage = 'An non-interactive element with an onClick handler and an ' + 'interactive role must be focusable. Either set the tabIndex property to ' + 'a valid value (usually 0) or use an element type which is inherently ' + 'focusable such as `button`.';

var schema = (0, _schemas.generateObjSchema)();

module.exports = {
  meta: {
    docs: {},
    schema: [schema]
  },

  create: function create(context) {
    return {
      JSXOpeningElement: function JSXOpeningElement(node) {
        var attributes = node.attributes;

        if ((0, _jsxAstUtils.getProp)(attributes, 'onClick') === undefined) {
          return;
        }

        var type = (0, _jsxAstUtils.elementType)(node);

        if ((0, _isHiddenFromScreenReader2.default)(type, attributes)) {
          return;
        } else if ((0, _isInteractiveElement2.default)(type, attributes)) {
          return;
        } else if (!(0, _isInteractiveRole2.default)(type, attributes)) {
          // A non-interactive element or an element without an interactive
          // role might have a click hanlder attached to it in order to catch
          // bubbled click events. In this case, the author should apply a role
          // of presentation to the element to indicate that it is not meant to
          // be interactive.
          return;
        } else if ((0, _getTabIndex2.default)((0, _jsxAstUtils.getProp)(attributes, 'tabIndex')) !== undefined) {
          return;
        }

        context.report({
          node: node,
          message: errorMessage
        });
      }
    };
  }
};