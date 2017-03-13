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





const BaseReporter = require('./BaseReporter');var _require =

require('jest-util');const clearLine = _require.clearLine;var _require2 =
require('istanbul-api');const createReporter = _require2.createReporter;
const chalk = require('chalk');
const fs = require('fs');
const generateEmptyCoverage = require('../generateEmptyCoverage');
const isCI = require('is-ci');
const istanbulCoverage = require('istanbul-lib-coverage');

const FAIL_COLOR = chalk.bold.red;
const RUNNING_TEST_COLOR = chalk.bold.dim;

const isInteractive = process.stdout.isTTY && !isCI;

class CoverageReporter extends BaseReporter {


  constructor() {
    super();
    this._coverageMap = istanbulCoverage.createCoverageMap({});
  }

  onTestResult(
  config,
  testResult,
  aggregatedResults)
  {
    if (testResult.coverage) {
      this._coverageMap.merge(testResult.coverage);
      // Remove coverage data to free up some memory.
      delete testResult.coverage;
    }
  }

  onRunComplete(
  config,
  aggregatedResults,
  runnerContext)
  {
    this._addUntestedFiles(config, runnerContext);
    const reporter = createReporter();
    try {
      if (config.coverageDirectory) {
        reporter.dir = config.coverageDirectory;
      }

      let coverageReporters = config.coverageReporters || [];
      if (
      !config.useStderr &&
      coverageReporters.length &&
      coverageReporters.indexOf('text') === -1)
      {
        coverageReporters = coverageReporters.concat(['text-summary']);
      }

      reporter.addAll(coverageReporters);
      reporter.write(this._coverageMap);
      aggregatedResults.coverageMap = this._coverageMap;
    } catch (e) {
      console.error(chalk.red(`
        Failed to write coverage reports:
        ERROR: ${ e.toString() }
        STACK: ${ e.stack }
      `));
    }

    this._checkThreshold(config);
  }

  _addUntestedFiles(config, runnerContext) {
    if (config.collectCoverageFrom && config.collectCoverageFrom.length) {
      if (isInteractive) {
        process.stderr.write(RUNNING_TEST_COLOR(
        'Running coverage on untested files...'));

      }
      const files = runnerContext.hasteFS.matchFilesWithGlob(
      config.collectCoverageFrom,
      config.rootDir);


      files.forEach(filename => {
        if (!this._coverageMap.data[filename]) {
          try {
            const source = fs.readFileSync(filename).toString();
            const coverage = generateEmptyCoverage(source, filename, config);
            if (coverage) {
              this._coverageMap.addFileCoverage(coverage);
            }
          } catch (e) {
            console.error(chalk.red(`
              Failed to collect coverage from ${ filename }
              ERROR: ${ e }
              STACK: ${ e.stack }
            `));
          }
        }
      });
      if (isInteractive) {
        clearLine(process.stderr);
      }
    }
  }

  _checkThreshold(config) {
    if (config.coverageThreshold) {
      const results = this._coverageMap.getCoverageSummary().toJSON();

      function check(name, thresholds, actuals) {
        return [
        'statements',
        'branches',
        'lines',
        'functions'].
        reduce((errors, key) => {
          const actual = actuals[key].pct;
          const actualUncovered = actuals[key].total - actuals[key].covered;
          const threshold = thresholds[key];

          if (threshold != null) {
            if (threshold < 0) {
              if (threshold * -1 < actualUncovered) {
                errors.push(
                `Jest: Uncovered count for ${ key } (${ actualUncovered })` +
                `exceeds ${ name } threshold (${ -1 * threshold })`);

              }
            } else if (actual < threshold) {
              errors.push(
              `Jest: Coverage for ${ key } (${ actual }` +
              `%) does not meet ${ name } threshold (${ threshold }%)`);

            }
          }
          return errors;
        }, []);
      }
      const errors = check(
      'global',
      config.coverageThreshold.global,
      results);


      if (errors.length > 0) {
        this.log(`${ FAIL_COLOR(errors.join('\n')) }`);
        this._setError(new Error(errors.join('\n')));
      }
    }
  }

  // Only exposed for the internal runner. Should not be used
  getCoverageMap() {
    return this._coverageMap;
  }}


module.exports = CoverageReporter;