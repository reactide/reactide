/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */
'use strict';var _require =




require('jest-util');const separateMessageFromStack = _require.separateMessageFromStack;

// Make sure uncaught errors are logged before we exit.
process.on('uncaughtException', err => {
  console.error(err.stack);
  process.exit(1);
});

const Runtime = require('jest-runtime');
const runTest = require('./runTest');








const formatError = error => {
  if (typeof error === 'string') {var _separateMessageFromS =
    separateMessageFromStack(error);const message = _separateMessageFromS.message,stack = _separateMessageFromS.stack;
    return {
      message,
      stack,
      type: 'Error' };

  }

  return {
    message: error.message,
    stack: error.stack,
    type: error.type || 'Error' };

};

const resolvers = Object.create(null);

module.exports = (data, callback) => {
  try {
    const name = data.config.name;
    if (!resolvers[name]) {
      resolvers[name] = Runtime.createResolver(
      data.config,
      Runtime.createHasteMap(data.config).readModuleMap());

    }

    runTest(data.path, data.config, resolvers[name]).
    then(
    result => callback(null, result),
    error => callback(formatError(error)));

  } catch (error) {
    callback(formatError(error));
  }
};