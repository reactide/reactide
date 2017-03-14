var understandable = require('./properties/understandable');

function backgroundPosition(validator, value1, value2) {
  if (!understandable(validator, value1, value2, 0, true) && !validator.isValidKeywordValue('background-position', value2, true)) {
    return false;
  } else if (validator.isValidVariable(value1) && validator.isValidVariable(value2)) {
    return true;
  } else if (validator.isValidKeywordValue('background-position', value2, true)) {
    return true;
  }

  return unit(validator, value1, value2);
}

function backgroundSize(validator, value1, value2) {
  if (!understandable(validator, value1, value2, 0, true) && !validator.isValidKeywordValue('background-size', value2, true)) {
    return false;
  } else if (validator.isValidVariable(value1) && validator.isValidVariable(value2)) {
    return true;
  } else if (validator.isValidKeywordValue('background-size', value2, true)) {
    return true;
  }

  return unit(validator, value1, value2);
}

function color(validator, value1, value2) {
  if (!understandable(validator, value1, value2, 0, true) && !validator.isValidColor(value2)) {
    return false;
  } else if (validator.isValidVariable(value1) && validator.isValidVariable(value2)) {
    return true;
  } else if (!validator.colorOpacity && (validator.isValidRgbaColor(value1) || validator.isValidHslaColor(value1))) {
    return false;
  } else if (!validator.colorOpacity && (validator.isValidRgbaColor(value2) || validator.isValidHslaColor(value2))) {
    return false;
  } else if (validator.isValidColor(value1) && validator.isValidColor(value2)) {
    return true;
  }

  return sameFunctionOrValue(validator, value1, value2);
}

function components(overrideCheckers) {
  return function (validator, value1, value2, position) {
    return overrideCheckers[position](validator, value1, value2);
  };
}

function image(validator, value1, value2) {
  if (!understandable(validator, value1, value2, 0, true) && !validator.isValidImage(value2)) {
    return false;
  } else if (validator.isValidVariable(value1) && validator.isValidVariable(value2)) {
    return true;
  } else if (validator.isValidImage(value2)) {
    return true;
  } else if (validator.isValidImage(value1)) {
    return false;
  }

  return sameFunctionOrValue(validator, value1, value2);
}

function keyword(propertyName) {
  return function(validator, value1, value2) {
    if (!understandable(validator, value1, value2, 0, true) && !validator.isValidKeywordValue(propertyName, value2)) {
      return false;
    } else if (validator.isValidVariable(value1) && validator.isValidVariable(value2)) {
      return true;
    }

    return validator.isValidKeywordValue(propertyName, value2, false);
  };
}

function keywordWithGlobal(propertyName) {
  return function(validator, value1, value2) {
    if (!understandable(validator, value1, value2, 0, true) && !validator.isValidKeywordValue(propertyName, value2, true)) {
      return false;
    } else if (validator.isValidVariable(value1) && validator.isValidVariable(value2)) {
      return true;
    }

    return validator.isValidKeywordValue(propertyName, value2, true);
  };
}

function sameFunctionOrValue(validator, value1, value2) {
  return validator.areSameFunction(value1, value2) ?
    true :
    value1 === value2;
}

function textShadow(validator, value1, value2) {
  if (!understandable(validator, value1, value2, 0, true) && !validator.isValidTextShadow(value2)) {
    return false;
  } else if (validator.isValidVariable(value1) && validator.isValidVariable(value2)) {
    return true;
  }

  return validator.isValidTextShadow(value2);
}

function unit(validator, value1, value2) {
  if (!understandable(validator, value1, value2, 0, true) && !validator.isValidUnitWithoutFunction(value2)) {
    return false;
  } else if (validator.isValidVariable(value1) && validator.isValidVariable(value2)) {
    return true;
  } else if (validator.isValidUnitWithoutFunction(value1) && !validator.isValidUnitWithoutFunction(value2)) {
    return false;
  } else if (validator.isValidUnitWithoutFunction(value2)) {
    return true;
  } else if (validator.isValidUnitWithoutFunction(value1)) {
    return false;
  } else if (validator.isValidFunctionWithoutVendorPrefix(value1) && validator.isValidFunctionWithoutVendorPrefix(value2)) {
    return true;
  }

  return sameFunctionOrValue(validator, value1, value2);
}

function unitOrKeywordWithGlobal(propertyName) {
  var byKeyword = keywordWithGlobal(propertyName);

  return function(validator, value1, value2) {
    return unit(validator, value1, value2) || byKeyword(validator, value1, value2);
  };
}

function zIndex(validator, value1, value2) {
  if (!understandable(validator, value1, value2, 0, true) && !validator.isValidZIndex(value2)) {
    return false;
  } else if (validator.isValidVariable(value1) && validator.isValidVariable(value2)) {
    return true;
  }

  return validator.isValidZIndex(value2);
}

module.exports = {
  generic: {
    color: color,
    components: components,
    image: image,
    unit: unit
  },
  property: {
    backgroundAttachment: keyword('background-attachment'),
    backgroundClip: keywordWithGlobal('background-clip'),
    backgroundOrigin: keyword('background-origin'),
    backgroundPosition: backgroundPosition,
    backgroundRepeat: keyword('background-repeat'),
    backgroundSize: backgroundSize,
    bottom: unitOrKeywordWithGlobal('bottom'),
    borderCollapse: keyword('border-collapse'),
    borderStyle: keywordWithGlobal('*-style'),
    clear: keywordWithGlobal('clear'),
    cursor: keywordWithGlobal('cursor'),
    display: keywordWithGlobal('display'),
    float: keywordWithGlobal('float'),
    fontStyle: keywordWithGlobal('font-style'),
    left: unitOrKeywordWithGlobal('left'),
    fontWeight: keywordWithGlobal('font-weight'),
    listStyleType: keywordWithGlobal('list-style-type'),
    listStylePosition: keywordWithGlobal('list-style-position'),
    outlineStyle: keywordWithGlobal('*-style'),
    overflow: keywordWithGlobal('overflow'),
    position: keywordWithGlobal('position'),
    right: unitOrKeywordWithGlobal('right'),
    textAlign: keywordWithGlobal('text-align'),
    textDecoration: keywordWithGlobal('text-decoration'),
    textOverflow: keywordWithGlobal('text-overflow'),
    textShadow: textShadow,
    top: unitOrKeywordWithGlobal('top'),
    transform: sameFunctionOrValue,
    verticalAlign: unitOrKeywordWithGlobal('vertical-align'),
    visibility: keywordWithGlobal('visibility'),
    whiteSpace: keywordWithGlobal('white-space'),
    zIndex: zIndex
  }
};
