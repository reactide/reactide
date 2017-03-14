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





const FakeTimers = require('jest-util').FakeTimers;
const installCommonGlobals = require('jest-util').installCommonGlobals;
const ModuleMocker = require('jest-mock');
const vm = require('vm');

class NodeEnvironment {






  constructor(config) {
    this.context = vm.createContext();
    const global = this.global = vm.runInContext('this', this.context);
    global.global = global;
    global.clearInterval = clearInterval;
    global.clearTimeout = clearTimeout;
    global.Promise = Promise;
    global.setInterval = setInterval;
    global.setTimeout = setTimeout;
    installCommonGlobals(global, config.globals);
    this.moduleMocker = new ModuleMocker(global);
    this.fakeTimers = new FakeTimers(global, this.moduleMocker, config);
  }

  dispose() {
    if (this.fakeTimers) {
      this.fakeTimers.dispose();
    }
    this.context = null;
    this.fakeTimers = null;
  }

  runScript(script) {
    if (this.context) {
      return script.runInContext(this.context);
    }
    return null;
  }}



module.exports = NodeEnvironment;