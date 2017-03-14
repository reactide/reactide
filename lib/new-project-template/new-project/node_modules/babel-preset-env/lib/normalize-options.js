"use strict";

exports.__esModule = true;
exports.getElectronChromeVersion = exports.validateModulesOption = exports.validateLooseOption = exports.checkDuplicateIncludeExcludes = exports.validateIncludesAndExcludes = undefined;
exports.default = normalizeOptions;

var _invariant = require("invariant");

var _invariant2 = _interopRequireDefault(_invariant);

var _electronToChromium = require("electron-to-chromium");

var _builtIns = require("../data/built-ins.json");

var _builtIns2 = _interopRequireDefault(_builtIns);

var _defaultIncludes = require("./default-includes");

var _defaultIncludes2 = _interopRequireDefault(_defaultIncludes);

var _moduleTransformations = require("./module-transformations");

var _moduleTransformations2 = _interopRequireDefault(_moduleTransformations);

var _pluginFeatures = require("../data/plugin-features");

var _pluginFeatures2 = _interopRequireDefault(_pluginFeatures);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var validIncludesAndExcludes = [].concat(Object.keys(_pluginFeatures2.default), Object.keys(_moduleTransformations2.default).map(function (m) {
  return _moduleTransformations2.default[m];
}), Object.keys(_builtIns2.default), _defaultIncludes2.default);

var hasBeenWarned = false;

var validateIncludesAndExcludes = exports.validateIncludesAndExcludes = function validateIncludesAndExcludes() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var type = arguments[1];

  (0, _invariant2.default)(Array.isArray(opts), "Invalid Option: The '" + type + "' option must be an Array<String> of plugins/built-ins");

  var unknownOpts = [];
  opts.forEach(function (opt) {
    if (validIncludesAndExcludes.indexOf(opt) === -1) {
      unknownOpts.push(opt);
    }
  });

  (0, _invariant2.default)(unknownOpts.length === 0, "Invalid Option: The plugins/built-ins '" + unknownOpts + "' passed to the '" + type + "' option are not\n    valid. Please check data/[plugin-features|built-in-features].js in babel-preset-env");

  return opts;
};

var checkDuplicateIncludeExcludes = exports.checkDuplicateIncludeExcludes = function checkDuplicateIncludeExcludes() {
  var include = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var exclude = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  var duplicates = include.filter(function (opt) {
    return exclude.indexOf(opt) >= 0;
  });

  (0, _invariant2.default)(duplicates.length === 0, "Invalid Option: The plugins/built-ins '" + duplicates + "' were found in both the \"include\" and\n    \"exclude\" options.");
};

// TODO: Allow specifying plugins as either shortened or full name
// babel-plugin-transform-es2015-classes
// transform-es2015-classes
var validateLooseOption = exports.validateLooseOption = function validateLooseOption() {
  var looseOpt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

  (0, _invariant2.default)(typeof looseOpt === "boolean", "Invalid Option: The 'loose' option must be a boolean.");

  return looseOpt;
};

var validateModulesOption = exports.validateModulesOption = function validateModulesOption() {
  var modulesOpt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "commonjs";

  (0, _invariant2.default)(modulesOpt === false || Object.keys(_moduleTransformations2.default).indexOf(modulesOpt) > -1, "Invalid Option: The 'modules' option must be either 'false' to indicate no modules, or a\n    module type which can be be one of: 'commonjs' (default), 'amd', 'umd', 'systemjs'.");

  return modulesOpt;
};

var getElectronChromeVersion = exports.getElectronChromeVersion = function getElectronChromeVersion(electronVersion) {
  var electronChromeVersion = parseInt((0, _electronToChromium.electronToChromium)(electronVersion), 10);

  (0, _invariant2.default)(!!electronChromeVersion, "Electron version " + electronVersion + " is either too old or too new");

  return electronChromeVersion;
};

function normalizeOptions(opts) {
  // TODO: remove whitelist in favor of include in next major
  if (opts.whitelist && !hasBeenWarned) {
    console.warn("Deprecation Warning: The \"whitelist\" option has been deprecated in favor of \"include\" to\n      match the newly added \"exclude\" option (instead of \"blacklist\").");
    hasBeenWarned = true;
  }

  (0, _invariant2.default)(!(opts.whitelist && opts.include), "Invalid Option: The \"whitelist\" and the \"include\" option are the same and one can be used at\n    a time");

  checkDuplicateIncludeExcludes(opts.whitelist || opts.include, opts.exclude);

  return {
    debug: opts.debug,
    exclude: validateIncludesAndExcludes(opts.exclude, "exclude"),
    include: validateIncludesAndExcludes(opts.whitelist || opts.include, "include"),
    loose: validateLooseOption(opts.loose),
    moduleType: validateModulesOption(opts.modules),
    targets: opts.targets,
    useBuiltIns: opts.useBuiltIns
  };
}