/**
 * Copyright (c) 2014, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */
/* eslint-disable max-len */

'use strict';var _require =







require('jest-util');const escapeStrForRegex = _require.escapeStrForRegex,formatStackTrace = _require.formatStackTrace,separateMessageFromStack = _require.separateMessageFromStack;var _require2 =






require('jest-matcher-utils');const RECEIVED_COLOR = _require2.RECEIVED_COLOR,getType = _require2.getType,matcherHint = _require2.matcherHint,printExpected = _require2.printExpected,printWithType = _require2.printWithType;var _require3 =


require('./jasmine-utils');const equals = _require3.equals;

const createMatcher = matcherName =>
(actual, expected) => {
  const value = expected;
  let error;

  try {
    actual();
  } catch (e) {
    error = e;
  }

  if (typeof expected === 'string') {
    expected = new RegExp(escapeStrForRegex(expected));
  }

  if (typeof expected === 'function') {
    return toThrowMatchingError(matcherName, error, expected);
  } else if (expected instanceof RegExp) {
    return toThrowMatchingStringOrRegexp(matcherName, error, expected, value);
  } else if (expected && typeof expected === 'object') {
    return toThrowMatchingErrorInstance(matcherName, error, expected);
  } else if (expected === undefined) {
    const pass = error !== undefined;
    return {
      message: pass ?
      () => matcherHint('.not' + matcherName, 'function', '') + '\n\n' +
      'Expected the function not to throw an error.\n' +
      printActualErrorMessage(error) :
      () => matcherHint(matcherName, 'function', getType(value)) + '\n\n' +
      'Expected the function to throw an error.\n' +
      printActualErrorMessage(error),
      pass };

  } else {
    throw new Error(
    matcherHint('.not' + matcherName, 'function', getType(value)) + '\n\n' +
    'Unexpected argument passed.\nExpected: ' +
    `${ printExpected('string') }, ${ printExpected('Error (type)') } or ${ printExpected('regexp') }.\n` +
    printWithType('Got', String(expected), printExpected));

  }
};

const matchers = {
  toThrow: createMatcher('.toThrow'),
  toThrowError: createMatcher('.toThrowError') };


const toThrowMatchingStringOrRegexp = (
name,
error,
pattern,
value) =>
{
  if (error && !error.message && !error.name) {
    error = new Error(error);
  }

  const pass = !!(error && error.message.match(pattern));
  const message = pass ?
  () => matcherHint('.not' + name, 'function', getType(value)) + '\n\n' +
  `Expected the function not to throw an error matching:\n` +
  `  ${ printExpected(value) }\n` +
  printActualErrorMessage(error) :
  () => matcherHint(name, 'function', getType(value)) + '\n\n' +
  `Expected the function to throw an error matching:\n` +
  `  ${ printExpected(value) }\n` +
  printActualErrorMessage(error);

  return { message, pass };
};

const toThrowMatchingErrorInstance = (
name,
error,
expectedError) =>
{
  if (error && !error.message && !error.name) {
    error = new Error(error);
  }

  const pass = equals(error, expectedError);
  const message = pass ?
  () => matcherHint('.not' + name, 'function', 'error') + '\n\n' +
  `Expected the function not to throw an error matching:\n` +
  `  ${ printExpected(expectedError) }\n` +
  printActualErrorMessage(error) :
  () => matcherHint(name, 'function', 'error') + '\n\n' +
  `Expected the function to throw an error matching:\n` +
  `  ${ printExpected(expectedError) }\n` +
  printActualErrorMessage(error);

  return { message, pass };
};

const toThrowMatchingError = (
name,
error,
ErrorClass) =>
{
  const pass = !!(error && error instanceof ErrorClass);
  const message = pass ?
  () => matcherHint('.not' + name, 'function', 'type') + '\n\n' +
  `Expected the function not to throw an error of type:\n` +
  `  ${ printExpected(ErrorClass.name) }\n` +
  printActualErrorMessage(error) :
  () => matcherHint(name, 'function', 'type') + '\n\n' +
  `Expected the function to throw an error of type:\n` +
  `  ${ printExpected(ErrorClass.name) }\n` +
  printActualErrorMessage(error);

  return { message, pass };
};

const printActualErrorMessage = error => {
  if (error) {var _separateMessageFromS =
    separateMessageFromStack(error.stack);const message = _separateMessageFromS.message,stack = _separateMessageFromS.stack;
    return (
      `Instead, it threw:\n` +
      RECEIVED_COLOR(
      '  ' + message + formatStackTrace(stack, {
        noStackTrace: false,
        rootDir: process.cwd(),
        testRegex: '' })));



  }

  return `But it didn't throw anything.`;
};

module.exports = matchers;