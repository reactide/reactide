'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (context) {
  var longForm = (context.options[0] || 'boolean') === 'boolean';

  return {
    BooleanTypeAnnotation: function BooleanTypeAnnotation(node) {
      var diff = node.end - node.start;

      if (longForm && diff === 4) {
        context.report({
          fix: function fix(fixer) {
            return fixer.replaceText(node, 'boolean');
          },

          message: 'Use "boolean", not "bool"',
          node: node
        });
      }

      if (!longForm && diff !== 4) {
        context.report({
          fix: function fix(fixer) {
            return fixer.replaceText(node, 'bool');
          },

          message: 'Use "bool", not "boolean"',
          node: node
        });
      }
    }
  };
};

module.exports = exports['default'];