var Units = [
  '%',
  'ch',
  'cm',
  'em',
  'ex',
  'in',
  'mm',
  'pc',
  'pt',
  'px',
  'rem',
  'vh',
  'vm',
  'vmax',
  'vmin',
  'vw'
];
var cssUnitRegexStr = '(\\-?\\.?\\d+\\.?\\d*(' + Units.join('|') + '|)|auto|inherit)';
var cssCalcRegexStr = '(\\-moz\\-|\\-webkit\\-)?calc\\([^\\)]+\\)';
var cssFunctionNoVendorRegexStr = '[A-Z]+(\\-|[A-Z]|[0-9])+\\(.*?\\)';
var cssFunctionVendorRegexStr = '\\-(\\-|[A-Z]|[0-9])+\\(.*?\\)';
var cssVariableRegexStr = 'var\\(\\-\\-[^\\)]+\\)';
var cssFunctionAnyRegexStr = '(' + cssVariableRegexStr + '|' + cssFunctionNoVendorRegexStr + '|' + cssFunctionVendorRegexStr + ')';
var cssUnitOrCalcRegexStr = '(' + cssUnitRegexStr + '|' + cssCalcRegexStr + ')';

var cssFunctionNoVendorRegex = new RegExp('^' + cssFunctionNoVendorRegexStr + '$', 'i');
var cssVariableRegex = new RegExp('^' + cssVariableRegexStr + '$', 'i');
var cssFunctionAnyRegex = new RegExp('^' + cssFunctionAnyRegexStr + '$', 'i');
var cssUnitRegex = new RegExp('^' + cssUnitRegexStr + '$', 'i');
var cssUnitOrCalcRegex = new RegExp('^' + cssUnitOrCalcRegexStr + '$', 'i');

var urlRegex = /^url\([\s\S]+\)$/i;

var globalKeywords = [
  'inherit',
  'initial',
  'unset'
];

var Keywords = {
  '*-style': [
    'auto',
    'dashed',
    'dotted',
    'double',
    'groove',
    'hidden',
    'inset',
    'none',
    'outset',
    'ridge',
    'solid'
  ],
  'background-attachment': [
    'fixed',
    'inherit',
    'local',
    'scroll'
  ],
  'background-clip': [
    'border-box',
    'content-box',
    'inherit',
    'padding-box',
    'text'
  ],
  'background-origin': [
    'border-box',
    'content-box',
    'inherit',
    'padding-box'
  ],
  'background-position': [
    'bottom',
    'center',
    'left',
    'right',
    'top'
  ],
  'background-repeat': [
    'no-repeat',
    'inherit',
    'repeat',
    'repeat-x',
    'repeat-y',
    'round',
    'space'
  ],
  'background-size': [
    'auto',
    'cover',
    'contain'
  ],
  'border-collapse': [
    'collapse',
    'inherit',
    'separate'
  ],
  'bottom': [
    'auto'
  ],
  'clear': [
    'both',
    'left',
    'none',
    'right'
  ],
  'cursor': [
    'all-scroll',
    'auto',
    'col-resize',
    'crosshair',
    'default',
    'e-resize',
    'help',
    'move',
    'n-resize',
    'ne-resize',
    'no-drop',
    'not-allowed',
    'nw-resize',
    'pointer',
    'progress',
    'row-resize',
    's-resize',
    'se-resize',
    'sw-resize',
    'text',
    'vertical-text',
    'w-resize',
    'wait'
  ],
  'display': [
    'block',
    'inline',
    'inline-block',
    'inline-table',
    'list-item',
    'none',
    'table',
    'table-caption',
    'table-cell',
    'table-column',
    'table-column-group',
    'table-footer-group',
    'table-header-group',
    'table-row',
    'table-row-group'
  ],
  'float': [
    'left',
    'none',
    'right'
  ],
  'left': [
    'auto'
  ],
  'font-style': [
    'italic',
    'normal',
    'oblique'
  ],
  'font-weight': [
    '100',
    '200',
    '300',
    '400',
    '500',
    '600',
    '700',
    '800',
    '900',
    'bold',
    'bolder',
    'lighter',
    'normal'
  ],
  'list-style-position': [
    'inside',
    'outside'
  ],
  'list-style-type': [
    'armenian',
    'circle',
    'decimal',
    'decimal-leading-zero',
    'disc',
    'decimal|disc', // this is the default value of list-style-type, see comment in compactable.js
    'georgian',
    'lower-alpha',
    'lower-greek',
    'lower-latin',
    'lower-roman',
    'none',
    'square',
    'upper-alpha',
    'upper-latin',
    'upper-roman'
  ],
  'overflow': [
    'auto',
    'hidden',
    'scroll',
    'visible'
  ],
  'position': [
    'absolute',
    'fixed',
    'relative',
    'static'
  ],
  'right': [
    'auto'
  ],
  'text-align': [
    'center',
    'justify',
    'left',
    'left|right', // this is the default value of list-style-type, see comment in compactable.js
    'right'
  ],
  'text-decoration': [
    'line-through',
    'none',
    'overline',
    'underline'
  ],
  'text-overflow': [
    'clip',
    'ellipsis'
  ],
  'top': [
    'auto'
  ],
  'vertical-align': [
    'baseline',
    'bottom',
    'middle',
    'sub',
    'super',
    'text-bottom',
    'text-top',
    'top'
  ],
  'visibility': [
    'collapse',
    'hidden',
    'visible'
  ],
  'white-space': [
    'normal',
    'nowrap',
    'pre'
  ],
  'width': [
    'inherit',
    'initial',
    'medium',
    'thick',
    'thin'
  ]
};

var VENDOR_PREFIX_PATTERN = /(^|\W)-\w+\-/;

function areSameFunction(value1, value2) {
  if (!isValidFunction(value1) || !isValidFunction(value2)) {
    return false;
  }

  var function1Name = value1.substring(0, value1.indexOf('('));
  var function2Name = value2.substring(0, value2.indexOf('('));

  return function1Name === function2Name;
}

function hasNoVendorPrefix(value) {
  return VENDOR_PREFIX_PATTERN.test(value);
}

function isValidBackgroundAttachment(value) {
  return Keywords['background-attachment'].indexOf(value) > -1;
}

function isValidBackgroundClip(value) {
  return Keywords['background-clip'].indexOf(value) > -1;
}

function isValidBackgroundRepeat(value) {
  return Keywords['background-repeat'].indexOf(value) > -1;
}

function isValidBackgroundOrigin(value) {
  return Keywords['background-origin'].indexOf(value) > -1;
}

function isValidBackgroundPosition(value) {
  var parts;
  var i, l;

  if (value === 'inherit') {
    return true;
  }

  parts = value.split(' ');
  for (i = 0, l = parts.length; i < l; i++) {
    if (parts[i] === '') {
      continue;
    } else if (isValidBackgroundPositionPart(parts[i])) {
      continue;
    }

    return false;
  }

  return true;
}

function isValidBackgroundPositionPart(value) {
  return Keywords['background-position'].indexOf(value) > -1 || cssUnitOrCalcRegex.test(value);
}

function isValidBackgroundSizePart(value) {
  return Keywords['background-size'].indexOf(value) > -1 || cssUnitRegex.test(value);
}

function isValidColor(value) {
  return isValidNamedColor(value) ||
    isValidColorValue(value);
}

function isValidColorValue(value) {
  return isValidHexColor(value) ||
    isValidRgbaColor(value) ||
    isValidHslaColor(value);
}

function isValidFunction(value) {
  return !urlRegex.test(value) && cssFunctionAnyRegex.test(value);
}

function isValidFunctionWithoutVendorPrefix(value) {
  return !urlRegex.test(value) && cssFunctionNoVendorRegex.test(value);
}

function isValidGlobalValue(value) {
  return globalKeywords.indexOf(value) > -1;
}

function isValidHexColor(value) {
  return (value.length === 4 || value.length === 7) && value[0] === '#';
}

function isValidHslaColor(value) {
  return value.length > 0 && value.indexOf('hsla(') === 0 && value.indexOf(')') === value.length - 1;
}

function isValidImage(value) {
  return value == 'none' || value == 'inherit' || isValidUrl(value);
}

function isValidKeywordValue(propertyName, value, includeGlobal) {
  return Keywords[propertyName].indexOf(value) > -1 || includeGlobal && isValidGlobalValue(value);
}

function isValidListStyleType(value) {
  return Keywords['list-style-type'].indexOf(value) > -1;
}

function isValidListStylePosition(value) {
  return Keywords['list-style-position'].indexOf(value) > -1;
}

function isValidNamedColor(value) {
  // We don't really check if it's a valid color value, but allow any letters in it
  return value !== 'auto' && (value === 'transparent' || value === 'inherit' || /^[a-zA-Z]+$/.test(value));
}

function isValidRgbaColor(value) {
  return value.length > 0 && value.indexOf('rgba(') === 0 && value.indexOf(')') === value.length - 1;
}

function isValidStyle(value) {
  return Keywords['*-style'].indexOf(value) > -1;
}

function isValidTextShadow(compatibleCssUnitRegex, value) {
  return isValidUnitWithoutFunction(compatibleCssUnitRegex, value) ||
    isValidColor(value) ||
    isValidGlobalValue(value);
}

function isValidUnit(compatibleCssUnitAnyRegex, value) {
  return compatibleCssUnitAnyRegex.test(value);
}

function isValidUnitWithoutFunction(compatibleCssUnitRegex, value) {
  return compatibleCssUnitRegex.test(value);
}

function isValidUrl(value) {
  return urlRegex.test(value);
}

function isValidVariable(value) {
  return cssVariableRegex.test(value);
}

function isValidVendorPrefixedValue(value) {
  return /^-([A-Za-z0-9]|-)*$/gi.test(value);
}

function isValidWidth(compatibleCssUnitRegex, value) {
  return isValidUnit(compatibleCssUnitRegex, value) || Keywords.width.indexOf(value) > -1;
}

function isValidZIndex(value) {
  return value == 'auto' ||
    isValidGlobalValue(value) ||
    value.length > 0 && value == ('' + parseInt(value));
}

function validator(compatibility) {
  var validUnits = Units.slice(0).filter(function (value) {
    return !(value in compatibility.units) || compatibility.units[value] === true;
  });

  var compatibleCssUnitRegexStr = '(\\-?\\.?\\d+\\.?\\d*(' + validUnits.join('|') + '|)|auto|inherit)';
  var compatibleCssUnitRegex = new RegExp('^' + compatibleCssUnitRegexStr + '$', 'i');
  var compatibleCssUnitAnyRegex = new RegExp('^(none|' + Keywords.width.join('|') + '|' + compatibleCssUnitRegexStr + '|' + cssVariableRegexStr + '|' + cssFunctionNoVendorRegexStr + '|' + cssFunctionVendorRegexStr + ')$', 'i');
  var colorOpacity = compatibility.colors.opacity;

  return {
    areSameFunction: areSameFunction,
    colorOpacity: colorOpacity,
    hasNoVendorPrefix: hasNoVendorPrefix,
    isValidBackgroundAttachment: isValidBackgroundAttachment,
    isValidBackgroundClip: isValidBackgroundClip,
    isValidBackgroundOrigin: isValidBackgroundOrigin,
    isValidBackgroundPosition: isValidBackgroundPosition,
    isValidBackgroundPositionPart: isValidBackgroundPositionPart,
    isValidBackgroundRepeat: isValidBackgroundRepeat,
    isValidBackgroundSizePart: isValidBackgroundSizePart,
    isValidColor: isValidColor,
    isValidColorValue: isValidColorValue,
    isValidFunction: isValidFunction,
    isValidFunctionWithoutVendorPrefix: isValidFunctionWithoutVendorPrefix,
    isValidGlobalValue: isValidGlobalValue,
    isValidHexColor: isValidHexColor,
    isValidHslaColor: isValidHslaColor,
    isValidImage: isValidImage,
    isValidKeywordValue: isValidKeywordValue,
    isValidListStylePosition: isValidListStylePosition,
    isValidListStyleType: isValidListStyleType,
    isValidNamedColor: isValidNamedColor,
    isValidRgbaColor: isValidRgbaColor,
    isValidStyle: isValidStyle,
    isValidTextShadow: isValidTextShadow.bind(null, compatibleCssUnitRegex),
    isValidUnit: isValidUnit.bind(null, compatibleCssUnitAnyRegex),
    isValidUnitWithoutFunction: isValidUnitWithoutFunction.bind(null, compatibleCssUnitRegex),
    isValidUrl: isValidUrl,
    isValidVariable: isValidVariable,
    isValidVendorPrefixedValue: isValidVendorPrefixedValue,
    isValidWidth: isValidWidth.bind(null, compatibleCssUnitRegex),
    isValidZIndex: isValidZIndex
  };
}

module.exports = validator;
