/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';var _slicedToArray = function () {function sliceIterator(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"]) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}return function (arr, i) {if (Array.isArray(arr)) {return arr;} else if (Symbol.iterator in Object(arr)) {return sliceIterator(arr, i);} else {throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();





const DependencyResolver = require('jest-resolve-dependencies');

const chalk = require('chalk');
const changedFiles = require('jest-changed-files');
const fileExists = require('jest-file-exists');
const path = require('path');var _require =



require('jest-util');const escapePathForRegex = _require.escapePathForRegex,replacePathSepForRegex = _require.replacePathSepForRegex;































const git = changedFiles.git;
const hg = changedFiles.hg;

const determineSCM = path => Promise.all([
git.isGitRepository(path),
hg.isHGRepository(path)]);

const pathToRegex = p => replacePathSepForRegex(p);
const pluralize = (
word,
count,
ending) =>
`${ count } ${ word }${ count === 1 ? '' : ending }`;

class SearchSource {












  constructor(
  hasteMap,
  config,
  options)
  {
    this._hasteContext = hasteMap;
    this._config = config;
    this._options = options || {
      skipNodeResolution: false };


    this._testPathDirPattern =
    new RegExp(config.testPathDirs.map(
    dir => escapePathForRegex(dir)).
    join('|'));

    this._testRegex = new RegExp(pathToRegex(config.testRegex));
    const ignorePattern = config.testPathIgnorePatterns;
    this._testIgnorePattern =
    ignorePattern.length ? new RegExp(ignorePattern.join('|')) : null;

    this._testPathCases = {
      testPathDirs: path => this._testPathDirPattern.test(path),
      testPathIgnorePatterns: path =>
      !this._testIgnorePattern ||
      !this._testIgnorePattern.test(path),

      testRegex: path => this._testRegex.test(path) };

  }

  _filterTestPathsWithStats(
  allPaths,
  testPathPattern)
  {
    const data = {
      paths: [],
      stats: {},
      total: allPaths.length };


    const testCases = Object.assign({}, this._testPathCases);
    if (testPathPattern) {
      const regex = new RegExp(testPathPattern, 'i');
      testCases.testPathPattern = path => regex.test(path);
    }

    data.paths = allPaths.filter(path => {
      return Object.keys(testCases).reduce((flag, key) => {
        if (testCases[key](path)) {
          data.stats[key] = ++data.stats[key] || 1;
          return flag && true;
        }
        data.stats[key] = data.stats[key] || 0;
        return false;
      }, true);
    });

    return data;
  }

  _getAllTestPaths(
  testPathPattern)
  {
    return this._filterTestPathsWithStats(
    this._hasteContext.hasteFS.getAllFiles(),
    testPathPattern);

  }

  isTestFilePath(path) {
    return Object.keys(this._testPathCases).every(key =>
    this._testPathCases[key](path));

  }

  findMatchingTests(
  testPathPattern)
  {
    if (testPathPattern && !(testPathPattern instanceof RegExp)) {
      const maybeFile = path.resolve(process.cwd(), testPathPattern);
      if (fileExists(maybeFile, this._hasteContext.hasteFS)) {
        return this._filterTestPathsWithStats([maybeFile]);
      }
    }

    return this._getAllTestPaths(testPathPattern);
  }

  findRelatedTests(allPaths) {
    const dependencyResolver = new DependencyResolver(
    this._hasteContext.resolver,
    this._hasteContext.hasteFS);

    return {
      paths: dependencyResolver.resolveInverse(
      allPaths,
      this.isTestFilePath.bind(this),
      {
        skipNodeResolution: this._options.skipNodeResolution }) };



  }

  findRelatedTestsFromPattern(
  paths)
  {
    if (Array.isArray(paths) && paths.length) {
      const resolvedPaths = paths.map(p => path.resolve(process.cwd(), p));
      return this.findRelatedTests(new Set(resolvedPaths));
    }
    return { paths: [] };
  }

  findChangedTests(options) {
    return Promise.all(this._config.testPathDirs.map(determineSCM)).
    then(repos => {
      if (!repos.every((_ref) => {var _ref2 = _slicedToArray(_ref, 2);let gitRepo = _ref2[0],hgRepo = _ref2[1];return gitRepo || hgRepo;})) {
        return {
          noSCM: true,
          paths: [] };

      }
      return Promise.all(Array.from(repos).map((_ref3) => {var _ref4 = _slicedToArray(_ref3, 2);let gitRepo = _ref4[0],hgRepo = _ref4[1];
        return gitRepo ?
        git.findChangedFiles(gitRepo, options) :
        hg.findChangedFiles(hgRepo, options);
      })).then(changedPathSets => this.findRelatedTests(
      new Set(Array.prototype.concat.apply([], changedPathSets))));

    });
  }

  getNoTestsFoundMessage(
  patternInfo,
  config,
  data)
  {
    if (patternInfo.onlyChanged) {
      return (
        chalk.bold(
        'No tests found related to files changed since last commit.\n') +

        chalk.dim(
        patternInfo.watch ?
        'Press `a` to run all tests, or run Jest with `--watchAll`.' :
        'Run Jest without `-o` to run all tests.'));


    }

    const testPathPattern = SearchSource.getTestPathPattern(patternInfo);
    const stats = data.stats || {};
    const statsMessage = Object.keys(stats).map(key => {
      const value = key === 'testPathPattern' ? testPathPattern : config[key];
      if (value) {
        const matches = pluralize('match', stats[key], 'es');
        return `  ${ key }: ${ chalk.yellow(value) } - ${ matches }`;
      }
      return null;
    }).filter(line => line).join('\n');

    return (
      chalk.bold('No tests found') + '\n' + (
      data.total ?
      `  ${ pluralize('file', data.total || 0, 's') } checked.\n` +
      statsMessage :
      `No files found in ${ config.rootDir }.\n` +
      `Make sure Jest's configuration does not exclude this directory.\n` +
      `To set up Jest, make sure a package.json file exists.\n` +
      `Jest Documentation: facebook.github.io/jest/docs/configuration.html`));


  }

  getTestPaths(patternInfo) {
    if (patternInfo.onlyChanged) {
      return this.findChangedTests({ lastCommit: patternInfo.lastCommit });
    } else if (patternInfo.findRelatedTests && patternInfo.paths) {
      return Promise.resolve(
      this.findRelatedTestsFromPattern(patternInfo.paths));

    } else if (patternInfo.testPathPattern != null) {
      return Promise.resolve(
      this.findMatchingTests(patternInfo.testPathPattern));

    } else {
      return Promise.resolve({ paths: [] });
    }
  }

  static getTestPathPattern(patternInfo) {
    const pattern = patternInfo.testPathPattern;
    const input = patternInfo.input;
    const formattedPattern = `/${ pattern || '' }/`;
    const formattedInput = patternInfo.shouldTreatInputAsPattern ?
    `/${ input || '' }/` :
    `"${ input || '' }"`;
    return input === pattern ? formattedInput : formattedPattern;
  }}



module.exports = SearchSource;