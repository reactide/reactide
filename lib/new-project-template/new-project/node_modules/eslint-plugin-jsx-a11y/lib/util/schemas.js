'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateObjSchema = exports.enumArraySchema = exports.arraySchema = undefined;

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * JSON schema to accept an array of unique strings
 */
var arraySchema = exports.arraySchema = {
  type: 'array',
  items: {
    type: 'string'
  },
  minItems: 1,
  uniqueItems: true,
  additionalItems: false
};

/**
 * JSON schema to accept an array of unique strings from an enumerated list.
 */
var enumArraySchema = exports.enumArraySchema = function enumArraySchema() {
  var enumeratedList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return (0, _objectAssign2.default)({}, arraySchema, {
    items: {
      type: 'string',
      enum: enumeratedList
    }
  });
};

/**
 * Factory function to generate an object schema
 * with specified properties object
 */
var generateObjSchema = exports.generateObjSchema = function generateObjSchema() {
  var properties = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    type: 'object',
    properties: properties
  };
};