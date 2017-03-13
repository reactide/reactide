'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.schema = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _utilities = require('./../utilities');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaults = {
  annotationStyle: 'none'
};

var looksLikeFlowFileAnnotation = function looksLikeFlowFileAnnotation(comment) {
  return (/@(?:no)?flow/i.test(comment)
  );
};

var isValidAnnotationStyle = function isValidAnnotationStyle(node, style) {
  if (style === 'none') {
    return true;
  }

  return style === node.type.toLowerCase();
};

var schema = exports.schema = [{
  enum: ['always']
}];

exports.default = function (context) {
  var checkThisFile = !_lodash2.default.get(context, 'settings.flowtype.onlyFilesWithFlowAnnotation') || (0, _utilities.isFlowFile)(context);

  if (!checkThisFile) {
    return {};
  }

  var always = context.options[0] === 'always';
  var style = _lodash2.default.get(context, 'options[1].annotationStyle', defaults.annotationStyle);

  return {
    Program: function Program(node) {
      var firstToken = node.tokens[0];

      var potentialFlowFileAnnotation = _lodash2.default.find(context.getAllComments(), function (comment) {
        return looksLikeFlowFileAnnotation(comment.value);
      });

      if (potentialFlowFileAnnotation) {
        if (firstToken && firstToken.start < potentialFlowFileAnnotation.start) {
          context.report(potentialFlowFileAnnotation, 'Flow file annotation not at the top of the file.');
        }

        if (!(0, _utilities.isFlowFileAnnotation)(potentialFlowFileAnnotation.value)) {
          context.report(potentialFlowFileAnnotation, 'Malformed flow file annotation.');
        }

        if (!isValidAnnotationStyle(potentialFlowFileAnnotation, style)) {
          var str = style === 'line' ? '`// @flow`' : '`/* @flow */`';

          context.report(potentialFlowFileAnnotation, 'Flow file annotation style must be ' + str);
        }
      } else if (always) {
        context.report(node, 'Flow file annotation is missing.');
      }
    }
  };
};