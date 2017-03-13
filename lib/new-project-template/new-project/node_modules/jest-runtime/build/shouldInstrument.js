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



const micromatch = require('micromatch');
const path = require('path');

const shouldInstrument = (filename, config) => {
  if (!config.collectCoverage) {
    return false;
  }

  if (config.testRegex && filename.match(config.testRegex)) {
    return false;
  }

  if (
  // This configuration field contains an object in the form of:
  // {'path/to/file.js': true}
  config.collectCoverageOnlyFrom &&
  !config.collectCoverageOnlyFrom[filename])
  {
    return false;
  }

  if (
  !config.collectCoverageOnlyFrom && // still cover if `only` is specified
  config.collectCoverageFrom &&
  !micromatch(
  [path.relative(config.rootDir, filename)],
  config.collectCoverageFrom).
  length)
  {
    return false;
  }


  if (
  config.coveragePathIgnorePatterns &&
  config.coveragePathIgnorePatterns.some(pattern => filename.match(pattern)))
  {
    return false;
  }

  if (config.mocksPattern && filename.match(config.mocksPattern)) {
    return false;
  }

  return true;
};


module.exports = shouldInstrument;