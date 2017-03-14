/**
 * Copyright (c) 2014, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';





const fileExists = require('jest-file-exists');

function compact(array) {
  const result = [];
  for (let i = 0; i < array.length; ++i) {
    const element = array[i];
    if (element != null) {
      result.push(element);
    }
  }
  return result;
}

/**
   * DependencyResolver is used to resolve the direct dependencies of a module or
   * to retrieve a list of all transitive inverse dependencies.
   */
class DependencyResolver {



  constructor(resolver, hasteFS) {
    this._resolver = resolver;
    this._hasteFS = hasteFS;
  }

  resolve(
  file,
  options)
  {
    const dependencies = this._hasteFS.getDependencies(file);
    if (!dependencies) {
      return [];
    }
    return compact(
    dependencies.map(dependency => {
      if (this._resolver.isCoreModule(dependency)) {
        return null;
      }
      try {
        return this._resolver.resolveModule(file, dependency, options);
      } catch (e) {}
      return this._resolver.getMockModule(file, dependency) || null;
    }));

  }

  resolveInverse(
  paths,
  filter,
  options)
  {
    const collectModules = (relatedPaths, moduleMap, changed) => {
      const visitedModules = new Set();
      while (changed.size) {
        changed = new Set(moduleMap.filter(module =>
        !visitedModules.has(module.file) &&
        module.dependencies.some(dep => dep && changed.has(dep))).
        map(module => {
          const file = module.file;
          if (filter(file)) {
            relatedPaths.add(file);
          }
          visitedModules.add(file);
          return module.file;
        }));
      }
      return relatedPaths;
    };

    if (!paths.size) {
      return [];
    }

    const relatedPaths = new Set();
    const changed = new Set();
    for (const path of paths) {
      if (fileExists(path, this._hasteFS)) {
        const module = this._hasteFS.exists(path);
        if (module) {
          changed.add(path);
          if (filter(path)) {
            relatedPaths.add(path);
          }
        }
      }
    }

    const modules = this._hasteFS.getAllFiles().map(file => ({
      dependencies: this.resolve(file, options),
      file }));

    return Array.from(collectModules(relatedPaths, modules, changed));
  }}



module.exports = DependencyResolver;