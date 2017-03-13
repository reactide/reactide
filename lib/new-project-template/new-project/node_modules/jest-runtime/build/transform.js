/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */
'use strict';




const createDirectory = require('jest-util').createDirectory;
const crypto = require('crypto');
const fileExists = require('jest-file-exists');
const fs = require('graceful-fs');
const getCacheFilePath = require('jest-haste-map').getCacheFilePath;
const path = require('path');
const shouldInstrument = require('./shouldInstrument');
const stableStringify = require('json-stable-stringify');
const vm = require('vm');

const VERSION = require('../package.json').version;





const EVAL_RESULT_VARIABLE = 'Object.<anonymous>';

const cache = new Map();
const configToJsonMap = new Map();
// Cache regular expressions to test whether the file needs to be preprocessed
const ignoreCache = new WeakMap();

const removeFile = path => {
  try {
    fs.unlinkSync(path);
  } catch (e) {}
};

const getCacheKey = (
fileData,
filename,
config,
instrument) =>
{
  if (!configToJsonMap.has(config)) {
    // We only need this set of config options that can likely influence
    // cached output instead of all config options.
    configToJsonMap.set(config, stableStringify({
      cacheDirectory: config.cacheDirectory,
      collectCoverage: config.collectCoverage,
      collectCoverageFrom: config.collectCoverageFrom,
      collectCoverageOnlyFrom: config.collectCoverageOnlyFrom,
      coveragePathIgnorePatterns: config.coveragePathIgnorePatterns,
      haste: config.haste,
      mocksPattern: config.mocksPattern,
      moduleFileExtensions: config.moduleFileExtensions,
      moduleNameMapper: config.moduleNameMapper,
      rootDir: config.rootDir,
      testPathDirs: config.testPathDirs,
      testRegex: config.testRegex,
      transformIgnorePatterns: config.transformIgnorePatterns }));

  }
  const configString = configToJsonMap.get(config) || '';
  const transformer = getTransformer(filename, config);

  if (transformer && typeof transformer.getCacheKey === 'function') {
    return transformer.getCacheKey(
    fileData,
    filename,
    configString,
    {
      instrument,
      watch: config.watch });


  } else {
    return crypto.createHash('md5').
    update(fileData).
    update(configString).
    update(instrument ? 'instrument' : '').
    digest('hex');
  }
};

const writeCacheFile = (cachePath, fileData) => {
  try {
    fs.writeFileSync(cachePath, fileData, 'utf8');
  } catch (e) {
    e.message = 'jest: failed to cache transform results in: ' + cachePath;
    removeFile(cachePath);
    throw e;
  }
};

const wrap = content =>
'({"' + EVAL_RESULT_VARIABLE +
'":function(module,exports,require,__dirname,__filename,global,jest){' +
content +
'\n}});';

const readCacheFile = (filename, cachePath) => {
  if (!fileExists(cachePath)) {
    return null;
  }

  let fileData;
  try {
    fileData = fs.readFileSync(cachePath, 'utf8');
  } catch (e) {
    e.message = 'jest: failed to read cache file: ' + cachePath;
    removeFile(cachePath);
    throw e;
  }

  if (fileData == null) {
    // We must have somehow created the file but failed to write to it,
    // let's delete it and retry.
    removeFile(cachePath);
  }
  return fileData;
};

const getScriptCacheKey = (filename, config, instrument) => {
  const mtime = fs.statSync(filename).mtime;
  return filename + '_' + mtime.getTime() + (
  instrument ? '_instrumented' : '');
};

const shouldTransform = (filename, config) => {
  if (!ignoreCache.has(config)) {
    if (!config.transformIgnorePatterns) {
      ignoreCache.set(config, null);
    } else {
      ignoreCache.set(
      config,
      new RegExp(config.transformIgnorePatterns.join('|')));

    }
  }

  const ignoreRegexp = ignoreCache.get(config);
  const isIgnored = ignoreRegexp ? ignoreRegexp.test(filename) : false;
  return (
    !!config.transform &&
    !!config.transform.length && (

    !config.transformIgnorePatterns.length ||
    !isIgnored));


};

const getFileCachePath = (
filename,
config,
content,
instrument) =>
{
  const baseCacheDir = getCacheFilePath(
  config.cacheDirectory,
  'jest-transform-cache-' + config.name,
  VERSION);

  const cacheKey = getCacheKey(content, filename, config, instrument);
  // Create sub folders based on the cacheKey to avoid creating one
  // directory with many files.
  const cacheDir = path.join(baseCacheDir, cacheKey[0] + cacheKey[1]);
  const cachePath = path.join(
  cacheDir,
  path.basename(filename, path.extname(filename)) + '_' + cacheKey);

  createDirectory(cacheDir);

  return cachePath;
};

const transformCache =
new WeakMap();

const getTransformer = (filename, config) => {
  const transformData = transformCache.get(config);
  const transformFileData = transformData ? transformData.get(filename) : null;

  if (transformFileData) {
    return transformFileData;
  }

  let transform;
  if (!config.transform || !config.transform.length) {
    transform = null;
  } else {
    let transformPath = null;
    for (let i = 0; i < config.transform.length; i++) {
      if (new RegExp(config.transform[i][0]).test(filename)) {
        transformPath = config.transform[i][1];
        break;
      }
    }
    if (transformPath) {
      // $FlowFixMe
      transform = require(transformPath);
      if (typeof transform.process !== 'function') {
        throw new TypeError(
        'Jest: a transform must export a `process` function.');

      }
    }
  }
  if (!transformCache.has(config)) {
    transformCache.set(config, new Map());
  }

  const cache = transformCache.get(config);
  // This is definitely set at this point but Flow requires this check.
  if (cache) {
    cache.set(filename, transform);
  }
  return transform;
};

const stripShebang = content => {
  // If the file data starts with a shebang remove it. Leaves the empty line
  // to keep stack trace line numbers correct.
  if (content.startsWith('#!')) {
    return content.replace(/^#!.*/, '');
  } else {
    return content;
  }
};

const instrumentFile = (
content,
filename,
config) =>
{
  // NOTE: Keeping these requires inside this function reduces a single run
  // time by 2sec if not running in `--coverage` mode
  const babel = require('babel-core');
  const babelPluginIstanbul = require('babel-plugin-istanbul').default;

  return babel.transform(content, {
    auxiliaryCommentBefore: ' istanbul ignore next ',
    babelrc: false,
    filename,
    plugins: [
    [
    babelPluginIstanbul,
    {
      cwd: config.rootDir, // files outside `cwd` will not be instrumented
      exclude: [] }]],



    retainLines: true }).
  code;
};

const transformSource = (
filename,
config,
content,
instrument) =>
{
  const transform = getTransformer(filename, config);
  const cacheFilePath = getFileCachePath(filename, config, content, instrument);
  // Ignore cache if `config.cache` is set (--no-cache)
  let result = config.cache ? readCacheFile(filename, cacheFilePath) : null;

  if (result) {
    return result;
  }

  result = content;

  if (transform && shouldTransform(filename, config)) {
    result = transform.process(result, filename, config, {
      instrument,
      watch: config.watch });

  }

  // That means that the transform has a custom instrumentation
  // logic and will handle it based on `config.collectCoverage` option
  const transformWillInstrument = transform && transform.canInstrument;

  if (!transformWillInstrument && instrument) {
    result = instrumentFile(result, filename, config);
  }

  writeCacheFile(cacheFilePath, result);
  return result;
};

const transformAndBuildScript = (
filename,
config,
options,
instrument) =>
{
  const isInternalModule = !!(options && options.isInternalModule);
  const content = stripShebang(fs.readFileSync(filename, 'utf8'));
  let wrappedResult;
  const willTransform = !isInternalModule && (
  shouldTransform(filename, config) || instrument);

  try {
    if (willTransform) {
      wrappedResult =
      wrap(transformSource(filename, config, content, instrument));
    } else {
      wrappedResult = wrap(content);
    }

    return new vm.Script(wrappedResult, { displayErrors: true, filename });
  } catch (e) {
    if (e.codeFrame) {
      e.stack = e.codeFrame;
    }

    if (config.logTransformErrors) {
      console.error(
      `FILENAME: ${ filename }\n` +
      `TRANSFORM: ${ willTransform.toString() }\n` +
      `INSTRUMENT: ${ instrument.toString() }\n` +
      `SOURCE:\n` +
      String(wrappedResult));

    }

    throw e;
  }
};

module.exports = (
filename,
config,
options) =>
{
  const instrument = shouldInstrument(filename, config);
  const scriptCacheKey = getScriptCacheKey(filename, config, instrument);
  let script = cache.get(scriptCacheKey);
  if (script) {
    return script;
  } else {
    script = transformAndBuildScript(filename, config, options, instrument);
    cache.set(scriptCacheKey, script);
    return script;
  }
};

module.exports.EVAL_RESULT_VARIABLE = EVAL_RESULT_VARIABLE;
module.exports.transformSource = transformSource;