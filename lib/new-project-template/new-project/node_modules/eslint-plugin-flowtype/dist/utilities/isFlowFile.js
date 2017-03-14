'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isFlowFileAnnotation = require('./isFlowFileAnnotation.js');

var _isFlowFileAnnotation2 = _interopRequireDefault(_isFlowFileAnnotation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (context) {
  var comments = context.getAllComments();

  if (!comments.length) {
    return false;
  }

  var firstComment = comments[0];

  return (0, _isFlowFileAnnotation2.default)(firstComment.value);
};

module.exports = exports['default'];