'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineFlowType = require('./rules/defineFlowType');

var _defineFlowType2 = _interopRequireDefault(_defineFlowType);

var _genericSpacing = require('./rules/genericSpacing');

var _genericSpacing2 = _interopRequireDefault(_genericSpacing);

var _noWeakTypes = require('./rules/noWeakTypes');

var _noWeakTypes2 = _interopRequireDefault(_noWeakTypes);

var _requireParameterType = require('./rules/requireParameterType');

var _requireParameterType2 = _interopRequireDefault(_requireParameterType);

var _requireReturnType = require('./rules/requireReturnType');

var _requireReturnType2 = _interopRequireDefault(_requireReturnType);

var _requireValidFileAnnotation = require('./rules/requireValidFileAnnotation');

var _requireValidFileAnnotation2 = _interopRequireDefault(_requireValidFileAnnotation);

var _semi = require('./rules/semi');

var _semi2 = _interopRequireDefault(_semi);

var _spaceAfterTypeColon = require('./rules/spaceAfterTypeColon');

var _spaceAfterTypeColon2 = _interopRequireDefault(_spaceAfterTypeColon);

var _spaceBeforeGenericBracket = require('./rules/spaceBeforeGenericBracket');

var _spaceBeforeGenericBracket2 = _interopRequireDefault(_spaceBeforeGenericBracket);

var _spaceBeforeTypeColon = require('./rules/spaceBeforeTypeColon');

var _spaceBeforeTypeColon2 = _interopRequireDefault(_spaceBeforeTypeColon);

var _unionIntersectionSpacing = require('./rules/unionIntersectionSpacing');

var _unionIntersectionSpacing2 = _interopRequireDefault(_unionIntersectionSpacing);

var _typeIdMatch = require('./rules/typeIdMatch');

var _typeIdMatch2 = _interopRequireDefault(_typeIdMatch);

var _useFlowType = require('./rules/useFlowType');

var _useFlowType2 = _interopRequireDefault(_useFlowType);

var _validSyntax = require('./rules/validSyntax');

var _validSyntax2 = _interopRequireDefault(_validSyntax);

var _booleanStyle = require('./rules/booleanStyle');

var _booleanStyle2 = _interopRequireDefault(_booleanStyle);

var _delimiterDangle = require('./rules/delimiterDangle');

var _delimiterDangle2 = _interopRequireDefault(_delimiterDangle);

var _noDupeKeys = require('./rules/noDupeKeys');

var _noDupeKeys2 = _interopRequireDefault(_noDupeKeys);

var _sortKeys = require('./rules/sortKeys');

var _sortKeys2 = _interopRequireDefault(_sortKeys);

var _recommended = require('./configs/recommended.json');

var _recommended2 = _interopRequireDefault(_recommended);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  configs: {
    recommended: _recommended2.default
  },
  rules: {
    'boolean-style': _booleanStyle2.default,
    'define-flow-type': _defineFlowType2.default,
    'delimiter-dangle': _delimiterDangle2.default,
    'generic-spacing': _genericSpacing2.default,
    'no-dupe-keys': _noDupeKeys2.default,
    'no-weak-types': _noWeakTypes2.default,
    'require-parameter-type': _requireParameterType2.default,
    'require-return-type': _requireReturnType2.default,
    'require-valid-file-annotation': _requireValidFileAnnotation2.default,
    semi: _semi2.default,
    'sort-keys': _sortKeys2.default,
    'space-after-type-colon': _spaceAfterTypeColon2.default,
    'space-before-generic-bracket': _spaceBeforeGenericBracket2.default,
    'space-before-type-colon': _spaceBeforeTypeColon2.default,
    'type-id-match': _typeIdMatch2.default,
    'union-intersection-spacing': _unionIntersectionSpacing2.default,
    'use-flow-type': _useFlowType2.default,
    'valid-syntax': _validSyntax2.default
  },
  rulesConfig: {
    'boolean-style': 0,
    'define-flow-type': 0,
    'delimiter-dangle': 0,
    'generic-spacing': 0,
    'no-dupe-keys': 0,
    'no-weak-types': 0,
    'require-parameter-type': 0,
    'require-return-type': 0,
    semi: 0,
    'sort-keys': 0,
    'space-after-type-colon': 0,
    'space-before-generic-bracket': 0,
    'space-before-type-colon': 0,
    'type-id-match': 0,
    'union-intersection-spacing': 0,
    'use-flow-type': 0,
    'valid-syntax': 0
  }
};
module.exports = exports['default'];