var sameVendorPrefixes = require('./vendor-prefixes').same;

function understandable(validator, value1, value2, _position, isPaired) {
  if (!sameVendorPrefixes(value1, value2)) {
    return false;
  }

  if (isPaired && validator.isValidVariable(value1) !== validator.isValidVariable(value2)) {
    return false;
  }

  return true;
}

module.exports = understandable;
