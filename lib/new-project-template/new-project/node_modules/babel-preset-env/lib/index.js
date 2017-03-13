"use strict";

exports.__esModule = true;
exports.transformIncludesAndExcludes = exports.getTargets = exports.getCurrentNodeVersion = exports.isPluginRequired = undefined;
exports.default = buildPreset;

var _browserslist = require("browserslist");

var _browserslist2 = _interopRequireDefault(_browserslist);

var _builtIns = require("../data/built-ins.json");

var _builtIns2 = _interopRequireDefault(_builtIns);

var _defaultIncludes = require("./default-includes");

var _defaultIncludes2 = _interopRequireDefault(_defaultIncludes);

var _moduleTransformations = require("./module-transformations");

var _moduleTransformations2 = _interopRequireDefault(_moduleTransformations);

var _normalizeOptions = require("./normalize-options.js");

var _normalizeOptions2 = _interopRequireDefault(_normalizeOptions);

var _plugins = require("../data/plugins.json");

var _plugins2 = _interopRequireDefault(_plugins);

var _transformPolyfillRequirePlugin = require("./transform-polyfill-require-plugin");

var _transformPolyfillRequirePlugin2 = _interopRequireDefault(_transformPolyfillRequirePlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Determine if a transformation is required
 * @param  {Object}  supportedEnvironments  An Object containing environment keys and the lowest
 *                                          supported version as a value
 * @param  {Object}  plugin                 An Object containing environment keys and the lowest
 *                                          version the feature was implemented in as a value
 * @return {Boolean}  Whether or not the transformation is required
 */
var isPluginRequired = exports.isPluginRequired = function isPluginRequired(supportedEnvironments, plugin) {
  if (supportedEnvironments.browsers) {
    supportedEnvironments = getTargets(supportedEnvironments);
  }

  var targetEnvironments = Object.keys(supportedEnvironments);

  if (targetEnvironments.length === 0) {
    return true;
  }

  var isRequiredForEnvironments = targetEnvironments.filter(function (environment) {
    // Feature is not implemented in that environment
    if (!plugin[environment]) {
      return true;
    }

    var lowestImplementedVersion = plugin[environment];
    var lowestTargetedVersion = supportedEnvironments[environment];

    if (typeof lowestTargetedVersion === "string") {
      throw new Error("Target version must be a number,\n          '" + lowestTargetedVersion + "' was given for '" + environment + "'");
    }

    return lowestTargetedVersion < lowestImplementedVersion;
  });

  return isRequiredForEnvironments.length > 0 ? true : false;
};

var isBrowsersQueryValid = function isBrowsersQueryValid(browsers) {
  return typeof browsers === "string" || Array.isArray(browsers);
};

var browserNameMap = {
  chrome: "chrome",
  edge: "edge",
  firefox: "firefox",
  ie: "ie",
  ios_saf: "ios",
  safari: "safari"
};

var getLowestVersions = function getLowestVersions(browsers) {
  return browsers.reduce(function (all, browser) {
    var _browser$split = browser.split(" "),
        browserName = _browser$split[0],
        browserVersion = _browser$split[1];

    var normalizedBrowserName = browserNameMap[browserName];
    var parsedBrowserVersion = parseInt(browserVersion);
    if (normalizedBrowserName && !isNaN(parsedBrowserVersion)) {
      all[normalizedBrowserName] = Math.min(all[normalizedBrowserName] || Infinity, parsedBrowserVersion);
    }
    return all;
  }, {});
};

var mergeBrowsers = function mergeBrowsers(fromQuery, fromTarget) {
  return Object.keys(fromTarget).reduce(function (queryObj, targKey) {
    if (targKey !== "browsers") {
      queryObj[targKey] = fromTarget[targKey];
    }
    return queryObj;
  }, fromQuery);
};

var getCurrentNodeVersion = exports.getCurrentNodeVersion = function getCurrentNodeVersion() {
  return parseFloat(process.versions.node);
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }
  return target;
};

var getTargets = exports.getTargets = function getTargets() {
  var targets = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var targetOpts = _extends({}, targets);

  if (targetOpts.node === true || targetOpts.node === "current") {
    targetOpts.node = getCurrentNodeVersion();
  }

  if (targetOpts.hasOwnProperty("uglify") && !targetOpts.uglify) {
    delete targetOpts.uglify;
  }

  // Replace Electron target with its Chrome equivalent
  if (targetOpts.electron) {
    var electronChromeVersion = (0, _normalizeOptions.getElectronChromeVersion)(targetOpts.electron);

    targetOpts.chrome = targetOpts.chrome ? Math.min(targetOpts.chrome, electronChromeVersion) : electronChromeVersion;

    delete targetOpts.electron;
  }

  var browserOpts = targetOpts.browsers;
  if (isBrowsersQueryValid(browserOpts)) {
    var queryBrowsers = getLowestVersions((0, _browserslist2.default)(browserOpts));
    return mergeBrowsers(queryBrowsers, targetOpts);
  }
  return targetOpts;
};

var hasBeenLogged = false;

var logPlugin = function logPlugin(plugin, targets, list) {
  var envList = list[plugin] || {};
  var filteredList = Object.keys(targets).reduce(function (a, b) {
    if (!envList[b] || targets[b] < envList[b]) {
      a[b] = targets[b];
    }
    return a;
  }, {});
  var logStr = "  " + plugin + " " + JSON.stringify(filteredList);
  console.log(logStr);
};

var filterItem = function filterItem(targets, exclusions, list, item) {
  var isDefault = _defaultIncludes2.default.indexOf(item) >= 0;
  var notExcluded = exclusions.indexOf(item) === -1;

  if (isDefault) return notExcluded;
  var isRequired = isPluginRequired(targets, list[item]);
  return isRequired && notExcluded;
};

var getBuiltInTargets = function getBuiltInTargets(targets) {
  var builtInTargets = _extends({}, targets);
  if (builtInTargets.uglify != null) {
    delete builtInTargets.uglify;
  }
  return builtInTargets;
};

var transformIncludesAndExcludes = exports.transformIncludesAndExcludes = function transformIncludesAndExcludes(opts) {
  return {
    all: opts,
    plugins: opts.filter(function (opt) {
      return !opt.match(/^(es\d+|web)\./);
    }),
    builtIns: opts.filter(function (opt) {
      return opt.match(/^(es\d+|web)\./);
    })
  };
};

function buildPreset(context) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var validatedOptions = (0, _normalizeOptions2.default)(opts);
  var debug = validatedOptions.debug,
      loose = validatedOptions.loose,
      moduleType = validatedOptions.moduleType,
      useBuiltIns = validatedOptions.useBuiltIns;


  var targets = getTargets(validatedOptions.targets);
  var include = transformIncludesAndExcludes(validatedOptions.include);
  var exclude = transformIncludesAndExcludes(validatedOptions.exclude);

  var filterPlugins = filterItem.bind(null, targets, exclude.plugins, _plugins2.default);
  var transformations = Object.keys(_plugins2.default).filter(filterPlugins).concat(include.plugins);

  var polyfills = void 0;
  var polyfillTargets = void 0;
  if (useBuiltIns) {
    polyfillTargets = getBuiltInTargets(targets);
    var filterBuiltIns = filterItem.bind(null, polyfillTargets, exclude.builtIns, _builtIns2.default);
    polyfills = Object.keys(_builtIns2.default).concat(_defaultIncludes2.default).filter(filterBuiltIns).concat(include.builtIns);
  }

  if (debug && !hasBeenLogged) {
    hasBeenLogged = true;
    console.log("babel-preset-env: `DEBUG` option");
    console.log("\nUsing targets:");
    console.log(JSON.stringify(targets, null, 2));
    console.log("\nModules transform: " + moduleType);
    console.log("\nUsing plugins:");
    transformations.forEach(function (transform) {
      logPlugin(transform, targets, _plugins2.default);
    });
    if (useBuiltIns && polyfills.length) {
      console.log("\nUsing polyfills:");
      polyfills.forEach(function (polyfill) {
        logPlugin(polyfill, polyfillTargets, _builtIns2.default);
      });
    }
  }

  var regenerator = transformations.indexOf("transform-regenerator") >= 0;
  var modulePlugin = moduleType !== false && _moduleTransformations2.default[moduleType];
  var plugins = [];

  modulePlugin && plugins.push([require("babel-plugin-" + modulePlugin), { loose: loose }]);

  plugins.push.apply(plugins, transformations.map(function (pluginName) {
    return [require("babel-plugin-" + pluginName), { loose: loose }];
  }));

  useBuiltIns && plugins.push([_transformPolyfillRequirePlugin2.default, { polyfills: polyfills, regenerator: regenerator }]);

  return {
    plugins: plugins
  };
}