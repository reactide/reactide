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




const babel = require('babel-core');
const crypto = require('crypto');
const fs = require('fs');
const jestPreset = require('babel-preset-jest');
const path = require('path');

const BABELRC_FILENAME = '.babelrc';

const cache = Object.create(null);

const getBabelRC = (filename, _ref) => {let useCache = _ref.useCache;
  const paths = [];
  let directory = filename;
  while (directory !== (directory = path.dirname(directory))) {
    if (useCache && cache[directory]) {
      break;
    }

    paths.push(directory);
    const configFilePath = path.join(directory, BABELRC_FILENAME);
    if (fs.existsSync(configFilePath)) {
      cache[directory] = fs.readFileSync(configFilePath, 'utf8');
      break;
    }
  }
  paths.forEach(directoryPath => {
    cache[directoryPath] = cache[directory];
  });

  return cache[directory] || '';
};

const createTransformer = options => {
  options = Object.assign({}, options, {
    auxiliaryCommentBefore: ' istanbul ignore next ',
    presets: (options && options.presets || []).concat([jestPreset]),
    retainLines: true });

  delete options.cacheDirectory;

  return {
    canInstrument: true,
    getCacheKey(
    fileData,
    filename,
    configString, _ref2)

    {let instrument = _ref2.instrument,watch = _ref2.watch;
      return crypto.createHash('md5').
      update(fileData).
      update(configString)
      // Don't use the in-memory cache in watch mode because the .babelrc
      // file may be modified.
      .update(getBabelRC(filename, { useCache: !watch })).
      update(instrument ? 'instrument' : '').
      digest('hex');
    },
    process(
    src,
    filename,
    config,
    transformOptions)
    {
      let plugins = options.plugins || [];

      if (transformOptions && transformOptions.instrument) {
        // Copied from jest-runtime transform.js
        plugins = plugins.concat([
        [
        require('babel-plugin-istanbul').default,
        {
          // files outside `cwd` will not be instrumented
          cwd: config.rootDir,
          exclude: [] }]]);



      }

      if (babel.util.canCompile(filename)) {
        return babel.transform(
        src,
        Object.assign({}, options, { filename, plugins })).
        code;
      }
      return src;
    } };

};

module.exports = createTransformer();
module.exports.createTransformer = createTransformer;