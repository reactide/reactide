'use strict';
'create index';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.quoteName = exports.spacingFixers = exports.iterateFunctionNodes = exports.isFlowFileAnnotation = exports.isFlowFile = exports.getParameterName = undefined;

var _getParameterName2 = require('./getParameterName.js');

var _getParameterName3 = _interopRequireDefault(_getParameterName2);

var _isFlowFile2 = require('./isFlowFile.js');

var _isFlowFile3 = _interopRequireDefault(_isFlowFile2);

var _isFlowFileAnnotation2 = require('./isFlowFileAnnotation.js');

var _isFlowFileAnnotation3 = _interopRequireDefault(_isFlowFileAnnotation2);

var _iterateFunctionNodes2 = require('./iterateFunctionNodes.js');

var _iterateFunctionNodes3 = _interopRequireDefault(_iterateFunctionNodes2);

var _spacingFixers2 = require('./spacingFixers');

var _spacingFixers = _interopRequireWildcard(_spacingFixers2);

var _quoteName2 = require('./quoteName');

var _quoteName3 = _interopRequireDefault(_quoteName2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.getParameterName = _getParameterName3.default;
exports.isFlowFile = _isFlowFile3.default;
exports.isFlowFileAnnotation = _isFlowFileAnnotation3.default;
exports.iterateFunctionNodes = _iterateFunctionNodes3.default;
exports.spacingFixers = _spacingFixers;
exports.quoteName = _quoteName3.default;