'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.recursivePatternCapture = recursivePatternCapture;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _doctrine = require('doctrine');

var _doctrine2 = _interopRequireDefault(_doctrine);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _parse = require('eslint-module-utils/parse');

var _parse2 = _interopRequireDefault(_parse);

var _resolve = require('eslint-module-utils/resolve');

var _resolve2 = _interopRequireDefault(_resolve);

var _ignore = require('eslint-module-utils/ignore');

var _ignore2 = _interopRequireDefault(_ignore);

var _hash = require('eslint-module-utils/hash');

var _unambiguous = require('eslint-module-utils/unambiguous');

var unambiguous = _interopRequireWildcard(_unambiguous);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const log = (0, _debug2.default)('eslint-plugin-import:ExportMap');

const exportCache = new Map();

class ExportMap {
  constructor(path) {
    this.path = path;
    this.namespace = new Map();
    // todo: restructure to key on path, value is resolver + map of names
    this.reexports = new Map();
    this.dependencies = new Map();
    this.errors = [];
  }

  get hasDefault() {
    return this.get('default') != null;
  } // stronger than this.has

  get size() {
    let size = this.namespace.size + this.reexports.size;
    this.dependencies.forEach(dep => size += dep().size);
    return size;
  }

  /**
   * Note that this does not check explicitly re-exported names for existence
   * in the base namespace, but it will expand all `export * from '...'` exports
   * if not found in the explicit namespace.
   * @param  {string}  name
   * @return {Boolean} true if `name` is exported by this module.
   */
  has(name) {
    if (this.namespace.has(name)) return true;
    if (this.reexports.has(name)) return true;

    // default exports must be explicitly re-exported (#328)
    if (name !== 'default') {
      for (let dep of this.dependencies.values()) {
        let innerMap = dep();

        // todo: report as unresolved?
        if (!innerMap) continue;

        if (innerMap.has(name)) return true;
      }
    }

    return false;
  }

  /**
   * ensure that imported name fully resolves.
   * @param  {[type]}  name [description]
   * @return {Boolean}      [description]
   */
  hasDeep(name) {
    if (this.namespace.has(name)) return { found: true, path: [this] };

    if (this.reexports.has(name)) {
      const reexports = this.reexports.get(name),
            imported = reexports.getImport();

      // if import is ignored, return explicit 'null'
      if (imported == null) return { found: true, path: [this] };

      // safeguard against cycles, only if name matches
      if (imported.path === this.path && reexports.local === name) {
        return { found: false, path: [this] };
      }

      const deep = imported.hasDeep(reexports.local);
      deep.path.unshift(this);

      return deep;
    }

    // default exports must be explicitly re-exported (#328)
    if (name !== 'default') {
      for (let dep of this.dependencies.values()) {
        let innerMap = dep();
        // todo: report as unresolved?
        if (!innerMap) continue;

        // safeguard against cycles
        if (innerMap.path === this.path) continue;

        let innerValue = innerMap.hasDeep(name);
        if (innerValue.found) {
          innerValue.path.unshift(this);
          return innerValue;
        }
      }
    }

    return { found: false, path: [this] };
  }

  get(name) {
    if (this.namespace.has(name)) return this.namespace.get(name);

    if (this.reexports.has(name)) {
      const reexports = this.reexports.get(name),
            imported = reexports.getImport();

      // if import is ignored, return explicit 'null'
      if (imported == null) return null;

      // safeguard against cycles, only if name matches
      if (imported.path === this.path && reexports.local === name) return undefined;

      return imported.get(reexports.local);
    }

    // default exports must be explicitly re-exported (#328)
    if (name !== 'default') {
      for (let dep of this.dependencies.values()) {
        let innerMap = dep();
        // todo: report as unresolved?
        if (!innerMap) continue;

        // safeguard against cycles
        if (innerMap.path === this.path) continue;

        let innerValue = innerMap.get(name);
        if (innerValue !== undefined) return innerValue;
      }
    }

    return undefined;
  }

  forEach(callback, thisArg) {
    this.namespace.forEach((v, n) => callback.call(thisArg, v, n, this));

    this.reexports.forEach((reexports, name) => {
      const reexported = reexports.getImport();
      // can't look up meta for ignored re-exports (#348)
      callback.call(thisArg, reexported && reexported.get(reexports.local), name, this);
    });

    this.dependencies.forEach(dep => dep().forEach((v, n) => n !== 'default' && callback.call(thisArg, v, n, this)));
  }

  // todo: keys, values, entries?

  reportErrors(context, declaration) {
    context.report({
      node: declaration.source,
      message: `Parse errors in imported module '${ declaration.source.value }': ` + `${ this.errors.map(e => `${ e.message } (${ e.lineNumber }:${ e.column })`).join(', ') }`
    });
  }
}

exports.default = ExportMap; /**
                              * parse docs from the first node that has leading comments
                              * @param  {...[type]} nodes [description]
                              * @return {{doc: object}}
                              */

function captureDoc(docStyleParsers) {
  const metadata = {},
        nodes = Array.prototype.slice.call(arguments, 1);

  // 'some' short-circuits on first 'true'
  nodes.some(n => {
    if (!n.leadingComments) return false;

    for (let name in docStyleParsers) {
      const doc = docStyleParsers[name](n.leadingComments);
      if (doc) {
        metadata.doc = doc;
      }
    }

    return true;
  });

  return metadata;
}

const availableDocStyleParsers = {
  jsdoc: captureJsDoc,
  tomdoc: captureTomDoc
};

/**
 * parse JSDoc from leading comments
 * @param  {...[type]} comments [description]
 * @return {{doc: object}}
 */
function captureJsDoc(comments) {
  let doc;

  // capture XSDoc
  comments.forEach(comment => {
    // skip non-block comments
    if (comment.value.slice(0, 4) !== '*\n *') return;
    try {
      doc = _doctrine2.default.parse(comment.value, { unwrap: true });
    } catch (err) {
      /* don't care, for now? maybe add to `errors?` */
    }
  });

  return doc;
}

/**
  * parse TomDoc section from comments
  */
function captureTomDoc(comments) {
  // collect lines up to first paragraph break
  const lines = [];
  for (let i = 0; i < comments.length; i++) {
    const comment = comments[i];
    if (comment.value.match(/^\s*$/)) break;
    lines.push(comment.value.trim());
  }

  // return doctrine-like object
  const statusMatch = lines.join(' ').match(/^(Public|Internal|Deprecated):\s*(.+)/);
  if (statusMatch) {
    return {
      description: statusMatch[2],
      tags: [{
        title: statusMatch[1].toLowerCase(),
        description: statusMatch[2]
      }]
    };
  }
}

ExportMap.get = function (source, context) {
  const path = (0, _resolve2.default)(source, context);
  if (path == null) return null;

  return ExportMap.for(path, context);
};

ExportMap.for = function (path, context) {
  let exportMap;

  const cacheKey = (0, _hash.hashObject)({
    settings: context.settings,
    parserPath: context.parserPath,
    parserOptions: context.parserOptions,
    path
  }).digest('hex');

  exportMap = exportCache.get(cacheKey);

  // return cached ignore
  if (exportMap === null) return null;

  const stats = _fs2.default.statSync(path);
  if (exportMap != null) {
    // date equality check
    if (exportMap.mtime - stats.mtime === 0) {
      return exportMap;
    }
    // future: check content equality?
  }

  // check valid extensions first
  if (!(0, _ignore.hasValidExtension)(path, context)) {
    exportCache.set(cacheKey, null);
    return null;
  }

  const content = _fs2.default.readFileSync(path, { encoding: 'utf8' });

  // check for and cache ignore
  if ((0, _ignore2.default)(path, context) && !unambiguous.potentialModulePattern.test(content)) {
    exportCache.set(cacheKey, null);
    return null;
  }

  exportMap = ExportMap.parse(path, content, context);

  // ambiguous modules return null
  if (exportMap == null) return null;

  exportMap.mtime = stats.mtime;

  exportCache.set(cacheKey, exportMap);
  return exportMap;
};

ExportMap.parse = function (path, content, context) {
  var m = new ExportMap(path);

  try {
    var ast = (0, _parse2.default)(path, content, context);
  } catch (err) {
    log('parse error:', path, err);
    m.errors.push(err);
    return m; // can't continue
  }

  if (!unambiguous.isModule(ast)) return null;

  const docstyle = context.settings && context.settings['import/docstyle'] || ['jsdoc'];
  const docStyleParsers = {};
  docstyle.forEach(style => {
    docStyleParsers[style] = availableDocStyleParsers[style];
  });

  // attempt to collect module doc
  ast.comments.some(c => {
    if (c.type !== 'Block') return false;
    try {
      const doc = _doctrine2.default.parse(c.value, { unwrap: true });
      if (doc.tags.some(t => t.title === 'module')) {
        m.doc = doc;
        return true;
      }
    } catch (err) {/* ignore */}
    return false;
  });

  const namespaces = new Map();

  function remotePath(node) {
    return _resolve2.default.relative(node.source.value, path, context.settings);
  }

  function resolveImport(node) {
    const rp = remotePath(node);
    if (rp == null) return null;
    return ExportMap.for(rp, context);
  }

  function getNamespace(identifier) {
    if (!namespaces.has(identifier.name)) return;

    return function () {
      return resolveImport(namespaces.get(identifier.name));
    };
  }

  function addNamespace(object, identifier) {
    const nsfn = getNamespace(identifier);
    if (nsfn) {
      Object.defineProperty(object, 'namespace', { get: nsfn });
    }

    return object;
  }

  ast.body.forEach(function (n) {

    if (n.type === 'ExportDefaultDeclaration') {
      const exportMeta = captureDoc(docStyleParsers, n);
      if (n.declaration.type === 'Identifier') {
        addNamespace(exportMeta, n.declaration);
      }
      m.namespace.set('default', exportMeta);
      return;
    }

    if (n.type === 'ExportAllDeclaration') {
      let remoteMap = remotePath(n);
      if (remoteMap == null) return;
      m.dependencies.set(remoteMap, () => ExportMap.for(remoteMap, context));
      return;
    }

    // capture namespaces in case of later export
    if (n.type === 'ImportDeclaration') {
      let ns;
      if (n.specifiers.some(s => s.type === 'ImportNamespaceSpecifier' && (ns = s))) {
        namespaces.set(ns.local.name, n);
      }
      return;
    }

    if (n.type === 'ExportNamedDeclaration') {
      // capture declaration
      if (n.declaration != null) {
        switch (n.declaration.type) {
          case 'FunctionDeclaration':
          case 'ClassDeclaration':
          case 'TypeAlias':
            // flowtype with babel-eslint parser
            m.namespace.set(n.declaration.id.name, captureDoc(docStyleParsers, n));
            break;
          case 'VariableDeclaration':
            n.declaration.declarations.forEach(d => recursivePatternCapture(d.id, id => m.namespace.set(id.name, captureDoc(docStyleParsers, d, n))));
            break;
        }
      }

      n.specifiers.forEach(s => {
        const exportMeta = {};
        let local;

        switch (s.type) {
          case 'ExportDefaultSpecifier':
            if (!n.source) return;
            local = 'default';
            break;
          case 'ExportNamespaceSpecifier':
            m.namespace.set(s.exported.name, Object.defineProperty(exportMeta, 'namespace', {
              get() {
                return resolveImport(n);
              }
            }));
            return;
          case 'ExportSpecifier':
            if (!n.source) {
              m.namespace.set(s.exported.name, addNamespace(exportMeta, s.local));
              return;
            }
          // else falls through
          default:
            local = s.local.name;
            break;
        }

        // todo: JSDoc
        m.reexports.set(s.exported.name, { local, getImport: () => resolveImport(n) });
      });
    }
  });

  return m;
};

/**
 * Traverse a pattern/identifier node, calling 'callback'
 * for each leaf identifier.
 * @param  {node}   pattern
 * @param  {Function} callback
 * @return {void}
 */
function recursivePatternCapture(pattern, callback) {
  switch (pattern.type) {
    case 'Identifier':
      // base case
      callback(pattern);
      break;

    case 'ObjectPattern':
      pattern.properties.forEach(p => {
        recursivePatternCapture(p.value, callback);
      });
      break;

    case 'ArrayPattern':
      pattern.elements.forEach(element => {
        if (element == null) return;
        recursivePatternCapture(element, callback);
      });
      break;
  }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkV4cG9ydE1hcC5qcyJdLCJuYW1lcyI6WyJyZWN1cnNpdmVQYXR0ZXJuQ2FwdHVyZSIsInVuYW1iaWd1b3VzIiwibG9nIiwiZXhwb3J0Q2FjaGUiLCJNYXAiLCJFeHBvcnRNYXAiLCJjb25zdHJ1Y3RvciIsInBhdGgiLCJuYW1lc3BhY2UiLCJyZWV4cG9ydHMiLCJkZXBlbmRlbmNpZXMiLCJlcnJvcnMiLCJoYXNEZWZhdWx0IiwiZ2V0Iiwic2l6ZSIsImZvckVhY2giLCJkZXAiLCJoYXMiLCJuYW1lIiwidmFsdWVzIiwiaW5uZXJNYXAiLCJoYXNEZWVwIiwiZm91bmQiLCJpbXBvcnRlZCIsImdldEltcG9ydCIsImxvY2FsIiwiZGVlcCIsInVuc2hpZnQiLCJpbm5lclZhbHVlIiwidW5kZWZpbmVkIiwiY2FsbGJhY2siLCJ0aGlzQXJnIiwidiIsIm4iLCJjYWxsIiwicmVleHBvcnRlZCIsInJlcG9ydEVycm9ycyIsImNvbnRleHQiLCJkZWNsYXJhdGlvbiIsInJlcG9ydCIsIm5vZGUiLCJzb3VyY2UiLCJtZXNzYWdlIiwidmFsdWUiLCJtYXAiLCJlIiwibGluZU51bWJlciIsImNvbHVtbiIsImpvaW4iLCJjYXB0dXJlRG9jIiwiZG9jU3R5bGVQYXJzZXJzIiwibWV0YWRhdGEiLCJub2RlcyIsIkFycmF5IiwicHJvdG90eXBlIiwic2xpY2UiLCJhcmd1bWVudHMiLCJzb21lIiwibGVhZGluZ0NvbW1lbnRzIiwiZG9jIiwiYXZhaWxhYmxlRG9jU3R5bGVQYXJzZXJzIiwianNkb2MiLCJjYXB0dXJlSnNEb2MiLCJ0b21kb2MiLCJjYXB0dXJlVG9tRG9jIiwiY29tbWVudHMiLCJjb21tZW50IiwicGFyc2UiLCJ1bndyYXAiLCJlcnIiLCJsaW5lcyIsImkiLCJsZW5ndGgiLCJtYXRjaCIsInB1c2giLCJ0cmltIiwic3RhdHVzTWF0Y2giLCJkZXNjcmlwdGlvbiIsInRhZ3MiLCJ0aXRsZSIsInRvTG93ZXJDYXNlIiwiZm9yIiwiZXhwb3J0TWFwIiwiY2FjaGVLZXkiLCJzZXR0aW5ncyIsInBhcnNlclBhdGgiLCJwYXJzZXJPcHRpb25zIiwiZGlnZXN0Iiwic3RhdHMiLCJzdGF0U3luYyIsIm10aW1lIiwic2V0IiwiY29udGVudCIsInJlYWRGaWxlU3luYyIsImVuY29kaW5nIiwicG90ZW50aWFsTW9kdWxlUGF0dGVybiIsInRlc3QiLCJtIiwiYXN0IiwiaXNNb2R1bGUiLCJkb2NzdHlsZSIsInN0eWxlIiwiYyIsInR5cGUiLCJ0IiwibmFtZXNwYWNlcyIsInJlbW90ZVBhdGgiLCJyZWxhdGl2ZSIsInJlc29sdmVJbXBvcnQiLCJycCIsImdldE5hbWVzcGFjZSIsImlkZW50aWZpZXIiLCJhZGROYW1lc3BhY2UiLCJvYmplY3QiLCJuc2ZuIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJib2R5IiwiZXhwb3J0TWV0YSIsInJlbW90ZU1hcCIsIm5zIiwic3BlY2lmaWVycyIsInMiLCJpZCIsImRlY2xhcmF0aW9ucyIsImQiLCJleHBvcnRlZCIsInBhdHRlcm4iLCJwcm9wZXJ0aWVzIiwicCIsImVsZW1lbnRzIiwiZWxlbWVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFxY2dCQSx1QixHQUFBQSx1Qjs7QUFyY2hCOzs7O0FBRUE7Ozs7QUFFQTs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOztBQUNBOztJQUFZQyxXOzs7Ozs7QUFFWixNQUFNQyxNQUFNLHFCQUFNLGdDQUFOLENBQVo7O0FBRUEsTUFBTUMsY0FBYyxJQUFJQyxHQUFKLEVBQXBCOztBQUVlLE1BQU1DLFNBQU4sQ0FBZ0I7QUFDN0JDLGNBQVlDLElBQVosRUFBa0I7QUFDaEIsU0FBS0EsSUFBTCxHQUFZQSxJQUFaO0FBQ0EsU0FBS0MsU0FBTCxHQUFpQixJQUFJSixHQUFKLEVBQWpCO0FBQ0E7QUFDQSxTQUFLSyxTQUFMLEdBQWlCLElBQUlMLEdBQUosRUFBakI7QUFDQSxTQUFLTSxZQUFMLEdBQW9CLElBQUlOLEdBQUosRUFBcEI7QUFDQSxTQUFLTyxNQUFMLEdBQWMsRUFBZDtBQUNEOztBQUVE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QUE0QkQ7QUFDRixHQXpFRDs7QUEyRUEsU0FBT2dFLENBQVA7QUFDRCxDQTFJRDs7QUE2SUE7Ozs7Ozs7QUFPTyxTQUFTakcsdUJBQVQsQ0FBaUMrSCxPQUFqQyxFQUEwQ2pHLFFBQTFDLEVBQW9EO0FBQ3pELFVBQVFpRyxRQUFReEIsSUFBaEI7QUFDRSxTQUFLLFlBQUw7QUFBbUI7QUFDakJ6RSxlQUFTaUcsT0FBVDtBQUNBOztBQUVGLFNBQUssZUFBTDtBQUNFQSxjQUFRQyxVQUFSLENBQW1CakgsT0FBbkIsQ0FBMkJrSCxLQUFLO0FBQzlCakksZ0NBQXdCaUksRUFBRXRGLEtBQTFCLEVBQWlDYixRQUFqQztBQUNELE9BRkQ7QUFHQTs7QUFFRixTQUFLLGNBQUw7QUFDRWlHLGNBQVFHLFFBQVIsQ0FBaUJuSCxPQUFqQixDQUEwQm9ILE9BQUQsSUFBYTtBQUNwQyxZQUFJQSxXQUFXLElBQWYsRUFBcUI7QUFDckJuSSxnQ0FBd0JtSSxPQUF4QixFQUFpQ3JHLFFBQWpDO0FBQ0QsT0FIRDtBQUlBO0FBaEJKO0FBa0JEIiwiZmlsZSI6IkV4cG9ydE1hcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBmcyBmcm9tICdmcydcblxuaW1wb3J0IGRvY3RyaW5lIGZyb20gJ2RvY3RyaW5lJ1xuXG5pbXBvcnQgZGVidWcgZnJvbSAnZGVidWcnXG5cbmltcG9ydCBwYXJzZSBmcm9tICdlc2xpbnQtbW9kdWxlLXV0aWxzL3BhcnNlJ1xuaW1wb3J0IHJlc29sdmUgZnJvbSAnZXNsaW50LW1vZHVsZS11dGlscy9yZXNvbHZlJ1xuaW1wb3J0IGlzSWdub3JlZCwgeyBoYXNWYWxpZEV4dGVuc2lvbiB9IGZyb20gJ2VzbGludC1tb2R1bGUtdXRpbHMvaWdub3JlJ1xuXG5pbXBvcnQgeyBoYXNoT2JqZWN0IH0gZnJvbSAnZXNsaW50LW1vZHVsZS11dGlscy9oYXNoJ1xuaW1wb3J0ICogYXMgdW5hbWJpZ3VvdXMgZnJvbSAnZXNsaW50LW1vZHVsZS11dGlscy91bmFtYmlndW91cydcblxuY29uc3QgbG9nID0gZGVidWcoJ2VzbGludC1wbHVnaW4taW1wb3J0OkV4cG9ydE1hcCcpXG5cbmNvbnN0IGV4cG9ydENhY2hlID0gbmV3IE1hcCgpXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV4cG9ydE1hcCB7XG4gIGNvbnN0cnVjdG9yKHBhdGgpIHtcbiAgICB0aGlzLnBhdGggPSBwYXRoXG4gICAgdGhpcy5uYW1lc3BhY2UgPSBuZXcgTWFwKClcbiAgICAvLyB0b2RvOiByZXN0cnVjdHVyZSB0byBrZXkgb24gcGF0aCwgdmFsdWUgaXMgcmVzb2x2ZXIgKyBtYXAgb2YgbmFtZXNcbiAgICB0aGlzLnJlZXhwb3J0cyA9IG5ldyBNYXAoKVxuICAgIHRoaXMuZGVwZW5kZW5jaWVzID0gbmV3IE1hcCgpXG4gICAgdGhpcy5lcnJvcnMgPSBbXVxuICB9XG5cbiAgZ2V0IGhhc0RlZmF1bHQoKSB7IHJldHVybiB0aGlzLmdldCgnZGVmYXVsdCcpICE9IG51bGwgfSAvLyBzdHJvbmdlciB0aGFuIHRoaXMuaGFzXG5cbiAgZ2V0IHNpemUoKSB7XG4gICAgbGV0IHNpemUgPSB0aGlzLm5hbWVzcGFjZS5zaXplICsgdGhpcy5yZWV4cG9ydHMuc2l6ZVxuICAgIHRoaXMuZGVwZW5kZW5jaWVzLmZvckVhY2goZGVwID0+IHNpemUgKz0gZGVwKCkuc2l6ZSlcbiAgICByZXR1cm4gc2l6ZVxuICB9XG5cbiAgLyoqXG4gICAqIE5vdGUgdGhhdCB0aGlzIGRvZXMgbm90IGNoZWNrIGV4cGxpY2l0bHkgcmUtZXhwb3J0ZWQgbmFtZXMgZm9yIGV4aXN0ZW5jZVxuICAgKiBpbiB0aGUgYmFzZSBuYW1lc3BhY2UsIGJ1dCBpdCB3aWxsIGV4cGFuZCBhbGwgYGV4cG9ydCAqIGZyb20gJy4uLidgIGV4cG9ydHNcbiAgICogaWYgbm90IGZvdW5kIGluIHRoZSBleHBsaWNpdCBuYW1lc3BhY2UuXG4gICAqIEBwYXJhbSAge3N0cmluZ30gIG5hbWVcbiAgICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSBpZiBgbmFtZWAgaXMgZXhwb3J0ZWQgYnkgdGhpcyBtb2R1bGUuXG4gICAqL1xuICBoYXMobmFtZSkge1xuICAgIGlmICh0aGlzLm5hbWVzcGFjZS5oYXMobmFtZSkpIHJldHVybiB0cnVlXG4gICAgaWYgKHRoaXMucmVleHBvcnRzLmhhcyhuYW1lKSkgcmV0dXJuIHRydWVcblxuICAgIC8vIGRlZmF1bHQgZXhwb3J0cyBtdXN0IGJlIGV4cGxpY2l0bHkgcmUtZXhwb3J0ZWQgKCMzMjgpXG4gICAgaWYgKG5hbWUgIT09ICdkZWZhdWx0Jykge1xuICAgICAgZm9yIChsZXQgZGVwIG9mIHRoaXMuZGVwZW5kZW5jaWVzLnZhbHVlcygpKSB7XG4gICAgICAgIGxldCBpbm5lck1hcCA9IGRlcCgpXG5cbiAgICAgICAgLy8gdG9kbzogcmVwb3J0IGFzIHVucmVzb2x2ZWQ/XG4gICAgICAgIGlmICghaW5uZXJNYXApIGNvbnRpbnVlXG5cbiAgICAgICAgaWYgKGlubmVyTWFwLmhhcyhuYW1lKSkgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIC8qKlxuICAgKiBlbnN1cmUgdGhhdCBpbXBvcnRlZCBuYW1lIGZ1bGx5IHJlc29sdmVzLlxuICAgKiBAcGFyYW0gIHtbdHlwZV19ICBuYW1lIFtkZXNjcmlwdGlvbl1cbiAgICogQHJldHVybiB7Qm9vbGVhbn0gICAgICBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBoYXNEZWVwKG5hbWUpIHtcbiAgICBpZiAodGhpcy5uYW1lc3BhY2UuaGFzKG5hbWUpKSByZXR1cm4geyBmb3VuZDogdHJ1ZSwgcGF0aDogW3RoaXNdIH1cblxuICAgIGlmICh0aGlzLnJlZXhwb3J0cy5oYXMobmFtZSkpIHtcbiAgICAgIGNvbnN0IHJlZXhwb3J0cyA9IHRoaXMucmVleHBvcnRzLmdldChuYW1lKVxuICAgICAgICAgICwgaW1wb3J0ZWQgPSByZWV4cG9ydHMuZ2V0SW1wb3J0KClcblxuICAgICAgLy8gaWYgaW1wb3J0IGlzIGlnbm9yZWQsIHJldHVybiBleHBsaWNpdCAnbnVsbCdcbiAgICAgIGlmIChpbXBvcnRlZCA9PSBudWxsKSByZXR1cm4geyBmb3VuZDogdHJ1ZSwgcGF0aDogW3RoaXNdIH1cblxuICAgICAgLy8gc2FmZWd1YXJkIGFnYWluc3QgY3ljbGVzLCBvbmx5IGlmIG5hbWUgbWF0Y2hlc1xuICAgICAgaWYgKGltcG9ydGVkLnBhdGggPT09IHRoaXMucGF0aCAmJiByZWV4cG9ydHMubG9jYWwgPT09IG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHsgZm91bmQ6IGZhbHNlLCBwYXRoOiBbdGhpc10gfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBkZWVwID0gaW1wb3J0ZWQuaGFzRGVlcChyZWV4cG9ydHMubG9jYWwpXG4gICAgICBkZWVwLnBhdGgudW5zaGlmdCh0aGlzKVxuXG4gICAgICByZXR1cm4gZGVlcFxuICAgIH1cblxuXG4gICAgLy8gZGVmYXVsdCBleHBvcnRzIG11c3QgYmUgZXhwbGljaXRseSByZS1leHBvcnRlZCAoIzMyOClcbiAgICBpZiAobmFtZSAhPT0gJ2RlZmF1bHQnKSB7XG4gICAgICBmb3IgKGxldCBkZXAgb2YgdGhpcy5kZXBlbmRlbmNpZXMudmFsdWVzKCkpIHtcbiAgICAgICAgbGV0IGlubmVyTWFwID0gZGVwKClcbiAgICAgICAgLy8gdG9kbzogcmVwb3J0IGFzIHVucmVzb2x2ZWQ/XG4gICAgICAgIGlmICghaW5uZXJNYXApIGNvbnRpbnVlXG5cbiAgICAgICAgLy8gc2FmZWd1YXJkIGFnYWluc3QgY3ljbGVzXG4gICAgICAgIGlmIChpbm5lck1hcC5wYXRoID09PSB0aGlzLnBhdGgpIGNvbnRpbnVlXG5cbiAgICAgICAgbGV0IGlubmVyVmFsdWUgPSBpbm5lck1hcC5oYXNEZWVwKG5hbWUpXG4gICAgICAgIGlmIChpbm5lclZhbHVlLmZvdW5kKSB7XG4gICAgICAgICAgaW5uZXJWYWx1ZS5wYXRoLnVuc2hpZnQodGhpcylcbiAgICAgICAgICByZXR1cm4gaW5uZXJWYWx1ZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgZm91bmQ6IGZhbHNlLCBwYXRoOiBbdGhpc10gfVxuICB9XG5cbiAgZ2V0KG5hbWUpIHtcbiAgICBpZiAodGhpcy5uYW1lc3BhY2UuaGFzKG5hbWUpKSByZXR1cm4gdGhpcy5uYW1lc3BhY2UuZ2V0KG5hbWUpXG5cbiAgICBpZiAodGhpcy5yZWV4cG9ydHMuaGFzKG5hbWUpKSB7XG4gICAgICBjb25zdCByZWV4cG9ydHMgPSB0aGlzLnJlZXhwb3J0cy5nZXQobmFtZSlcbiAgICAgICAgICAsIGltcG9ydGVkID0gcmVleHBvcnRzLmdldEltcG9ydCgpXG5cbiAgICAgIC8vIGlmIGltcG9ydCBpcyBpZ25vcmVkLCByZXR1cm4gZXhwbGljaXQgJ251bGwnXG4gICAgICBpZiAoaW1wb3J0ZWQgPT0gbnVsbCkgcmV0dXJuIG51bGxcblxuICAgICAgLy8gc2FmZWd1YXJkIGFnYWluc3QgY3ljbGVzLCBvbmx5IGlmIG5hbWUgbWF0Y2hlc1xuICAgICAgaWYgKGltcG9ydGVkLnBhdGggPT09IHRoaXMucGF0aCAmJiByZWV4cG9ydHMubG9jYWwgPT09IG5hbWUpIHJldHVybiB1bmRlZmluZWRcblxuICAgICAgcmV0dXJuIGltcG9ydGVkLmdldChyZWV4cG9ydHMubG9jYWwpXG4gICAgfVxuXG4gICAgLy8gZGVmYXVsdCBleHBvcnRzIG11c3QgYmUgZXhwbGljaXRseSByZS1leHBvcnRlZCAoIzMyOClcbiAgICBpZiAobmFtZSAhPT0gJ2RlZmF1bHQnKSB7XG4gICAgICBmb3IgKGxldCBkZXAgb2YgdGhpcy5kZXBlbmRlbmNpZXMudmFsdWVzKCkpIHtcbiAgICAgICAgbGV0IGlubmVyTWFwID0gZGVwKClcbiAgICAgICAgLy8gdG9kbzogcmVwb3J0IGFzIHVucmVzb2x2ZWQ/XG4gICAgICAgIGlmICghaW5uZXJNYXApIGNvbnRpbnVlXG5cbiAgICAgICAgLy8gc2FmZWd1YXJkIGFnYWluc3QgY3ljbGVzXG4gICAgICAgIGlmIChpbm5lck1hcC5wYXRoID09PSB0aGlzLnBhdGgpIGNvbnRpbnVlXG5cbiAgICAgICAgbGV0IGlubmVyVmFsdWUgPSBpbm5lck1hcC5nZXQobmFtZSlcbiAgICAgICAgaWYgKGlubmVyVmFsdWUgIT09IHVuZGVmaW5lZCkgcmV0dXJuIGlubmVyVmFsdWVcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdW5kZWZpbmVkXG4gIH1cblxuICBmb3JFYWNoKGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgdGhpcy5uYW1lc3BhY2UuZm9yRWFjaCgodiwgbikgPT5cbiAgICAgIGNhbGxiYWNrLmNhbGwodGhpc0FyZywgdiwgbiwgdGhpcykpXG5cbiAgICB0aGlzLnJlZXhwb3J0cy5mb3JFYWNoKChyZWV4cG9ydHMsIG5hbWUpID0+IHtcbiAgICAgIGNvbnN0IHJlZXhwb3J0ZWQgPSByZWV4cG9ydHMuZ2V0SW1wb3J0KClcbiAgICAgIC8vIGNhbid0IGxvb2sgdXAgbWV0YSBmb3IgaWdub3JlZCByZS1leHBvcnRzICgjMzQ4KVxuICAgICAgY2FsbGJhY2suY2FsbCh0aGlzQXJnLCByZWV4cG9ydGVkICYmIHJlZXhwb3J0ZWQuZ2V0KHJlZXhwb3J0cy5sb2NhbCksIG5hbWUsIHRoaXMpXG4gICAgfSlcblxuICAgIHRoaXMuZGVwZW5kZW5jaWVzLmZvckVhY2goZGVwID0+IGRlcCgpLmZvckVhY2goKHYsIG4pID0+XG4gICAgICBuICE9PSAnZGVmYXVsdCcgJiYgY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB2LCBuLCB0aGlzKSkpXG4gIH1cblxuICAvLyB0b2RvOiBrZXlzLCB2YWx1ZXMsIGVudHJpZXM/XG5cbiAgcmVwb3J0RXJyb3JzKGNvbnRleHQsIGRlY2xhcmF0aW9uKSB7XG4gICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgbm9kZTogZGVjbGFyYXRpb24uc291cmNlLFxuICAgICAgbWVzc2FnZTogYFBhcnNlIGVycm9ycyBpbiBpbXBvcnRlZCBtb2R1bGUgJyR7ZGVjbGFyYXRpb24uc291cmNlLnZhbHVlfSc6IGAgK1xuICAgICAgICAgICAgICAgICAgYCR7dGhpcy5lcnJvcnNcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoZSA9PiBgJHtlLm1lc3NhZ2V9ICgke2UubGluZU51bWJlcn06JHtlLmNvbHVtbn0pYClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5qb2luKCcsICcpfWAsXG4gICAgfSlcbiAgfVxufVxuXG4vKipcbiAqIHBhcnNlIGRvY3MgZnJvbSB0aGUgZmlyc3Qgbm9kZSB0aGF0IGhhcyBsZWFkaW5nIGNvbW1lbnRzXG4gKiBAcGFyYW0gIHsuLi5bdHlwZV19IG5vZGVzIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge3tkb2M6IG9iamVjdH19XG4gKi9cbmZ1bmN0aW9uIGNhcHR1cmVEb2MoZG9jU3R5bGVQYXJzZXJzKSB7XG4gIGNvbnN0IG1ldGFkYXRhID0ge31cbiAgICAgICAsIG5vZGVzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKVxuXG4gIC8vICdzb21lJyBzaG9ydC1jaXJjdWl0cyBvbiBmaXJzdCAndHJ1ZSdcbiAgbm9kZXMuc29tZShuID0+IHtcbiAgICBpZiAoIW4ubGVhZGluZ0NvbW1lbnRzKSByZXR1cm4gZmFsc2VcblxuICAgIGZvciAobGV0IG5hbWUgaW4gZG9jU3R5bGVQYXJzZXJzKSB7XG4gICAgICBjb25zdCBkb2MgPSBkb2NTdHlsZVBhcnNlcnNbbmFtZV0obi5sZWFkaW5nQ29tbWVudHMpXG4gICAgICBpZiAoZG9jKSB7XG4gICAgICAgIG1ldGFkYXRhLmRvYyA9IGRvY1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlXG4gIH0pXG5cbiAgcmV0dXJuIG1ldGFkYXRhXG59XG5cbmNvbnN0IGF2YWlsYWJsZURvY1N0eWxlUGFyc2VycyA9IHtcbiAganNkb2M6IGNhcHR1cmVKc0RvYyxcbiAgdG9tZG9jOiBjYXB0dXJlVG9tRG9jLFxufVxuXG4vKipcbiAqIHBhcnNlIEpTRG9jIGZyb20gbGVhZGluZyBjb21tZW50c1xuICogQHBhcmFtICB7Li4uW3R5cGVdfSBjb21tZW50cyBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHt7ZG9jOiBvYmplY3R9fVxuICovXG5mdW5jdGlvbiBjYXB0dXJlSnNEb2MoY29tbWVudHMpIHtcbiAgbGV0IGRvY1xuXG4gIC8vIGNhcHR1cmUgWFNEb2NcbiAgY29tbWVudHMuZm9yRWFjaChjb21tZW50ID0+IHtcbiAgICAvLyBza2lwIG5vbi1ibG9jayBjb21tZW50c1xuICAgIGlmIChjb21tZW50LnZhbHVlLnNsaWNlKDAsIDQpICE9PSAnKlxcbiAqJykgcmV0dXJuXG4gICAgdHJ5IHtcbiAgICAgIGRvYyA9IGRvY3RyaW5lLnBhcnNlKGNvbW1lbnQudmFsdWUsIHsgdW53cmFwOiB0cnVlIH0pXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAvKiBkb24ndCBjYXJlLCBmb3Igbm93PyBtYXliZSBhZGQgdG8gYGVycm9ycz9gICovXG4gICAgfVxuICB9KVxuXG4gIHJldHVybiBkb2Ncbn1cblxuLyoqXG4gICogcGFyc2UgVG9tRG9jIHNlY3Rpb24gZnJvbSBjb21tZW50c1xuICAqL1xuZnVuY3Rpb24gY2FwdHVyZVRvbURvYyhjb21tZW50cykge1xuICAvLyBjb2xsZWN0IGxpbmVzIHVwIHRvIGZpcnN0IHBhcmFncmFwaCBicmVha1xuICBjb25zdCBsaW5lcyA9IFtdXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY29tbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBjb21tZW50ID0gY29tbWVudHNbaV1cbiAgICBpZiAoY29tbWVudC52YWx1ZS5tYXRjaCgvXlxccyokLykpIGJyZWFrXG4gICAgbGluZXMucHVzaChjb21tZW50LnZhbHVlLnRyaW0oKSlcbiAgfVxuXG4gIC8vIHJldHVybiBkb2N0cmluZS1saWtlIG9iamVjdFxuICBjb25zdCBzdGF0dXNNYXRjaCA9IGxpbmVzLmpvaW4oJyAnKS5tYXRjaCgvXihQdWJsaWN8SW50ZXJuYWx8RGVwcmVjYXRlZCk6XFxzKiguKykvKVxuICBpZiAoc3RhdHVzTWF0Y2gpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZGVzY3JpcHRpb246IHN0YXR1c01hdGNoWzJdLFxuICAgICAgdGFnczogW3tcbiAgICAgICAgdGl0bGU6IHN0YXR1c01hdGNoWzFdLnRvTG93ZXJDYXNlKCksXG4gICAgICAgIGRlc2NyaXB0aW9uOiBzdGF0dXNNYXRjaFsyXSxcbiAgICAgIH1dLFxuICAgIH1cbiAgfVxufVxuXG5FeHBvcnRNYXAuZ2V0ID0gZnVuY3Rpb24gKHNvdXJjZSwgY29udGV4dCkge1xuICBjb25zdCBwYXRoID0gcmVzb2x2ZShzb3VyY2UsIGNvbnRleHQpXG4gIGlmIChwYXRoID09IG51bGwpIHJldHVybiBudWxsXG5cbiAgcmV0dXJuIEV4cG9ydE1hcC5mb3IocGF0aCwgY29udGV4dClcbn1cblxuRXhwb3J0TWFwLmZvciA9IGZ1bmN0aW9uIChwYXRoLCBjb250ZXh0KSB7XG4gIGxldCBleHBvcnRNYXBcblxuICBjb25zdCBjYWNoZUtleSA9IGhhc2hPYmplY3Qoe1xuICAgIHNldHRpbmdzOiBjb250ZXh0LnNldHRpbmdzLFxuICAgIHBhcnNlclBhdGg6IGNvbnRleHQucGFyc2VyUGF0aCxcbiAgICBwYXJzZXJPcHRpb25zOiBjb250ZXh0LnBhcnNlck9wdGlvbnMsXG4gICAgcGF0aCxcbiAgfSkuZGlnZXN0KCdoZXgnKVxuXG4gIGV4cG9ydE1hcCA9IGV4cG9ydENhY2hlLmdldChjYWNoZUtleSlcblxuICAvLyByZXR1cm4gY2FjaGVkIGlnbm9yZVxuICBpZiAoZXhwb3J0TWFwID09PSBudWxsKSByZXR1cm4gbnVsbFxuXG4gIGNvbnN0IHN0YXRzID0gZnMuc3RhdFN5bmMocGF0aClcbiAgaWYgKGV4cG9ydE1hcCAhPSBudWxsKSB7XG4gICAgLy8gZGF0ZSBlcXVhbGl0eSBjaGVja1xuICAgIGlmIChleHBvcnRNYXAubXRpbWUgLSBzdGF0cy5tdGltZSA9PT0gMCkge1xuICAgICAgcmV0dXJuIGV4cG9ydE1hcFxuICAgIH1cbiAgICAvLyBmdXR1cmU6IGNoZWNrIGNvbnRlbnQgZXF1YWxpdHk/XG4gIH1cblxuICAvLyBjaGVjayB2YWxpZCBleHRlbnNpb25zIGZpcnN0XG4gIGlmICghaGFzVmFsaWRFeHRlbnNpb24ocGF0aCwgY29udGV4dCkpIHtcbiAgICBleHBvcnRDYWNoZS5zZXQoY2FjaGVLZXksIG51bGwpXG4gICAgcmV0dXJuIG51bGxcbiAgfVxuXG4gIGNvbnN0IGNvbnRlbnQgPSBmcy5yZWFkRmlsZVN5bmMocGF0aCwgeyBlbmNvZGluZzogJ3V0ZjgnIH0pXG5cbiAgLy8gY2hlY2sgZm9yIGFuZCBjYWNoZSBpZ25vcmVcbiAgaWYgKGlzSWdub3JlZChwYXRoLCBjb250ZXh0KSAmJiAhdW5hbWJpZ3VvdXMucG90ZW50aWFsTW9kdWxlUGF0dGVybi50ZXN0KGNvbnRlbnQpKSB7XG4gICAgZXhwb3J0Q2FjaGUuc2V0KGNhY2hlS2V5LCBudWxsKVxuICAgIHJldHVybiBudWxsXG4gIH1cblxuICBleHBvcnRNYXAgPSBFeHBvcnRNYXAucGFyc2UocGF0aCwgY29udGVudCwgY29udGV4dClcblxuICAvLyBhbWJpZ3VvdXMgbW9kdWxlcyByZXR1cm4gbnVsbFxuICBpZiAoZXhwb3J0TWFwID09IG51bGwpIHJldHVybiBudWxsXG5cbiAgZXhwb3J0TWFwLm10aW1lID0gc3RhdHMubXRpbWVcblxuICBleHBvcnRDYWNoZS5zZXQoY2FjaGVLZXksIGV4cG9ydE1hcClcbiAgcmV0dXJuIGV4cG9ydE1hcFxufVxuXG5cbkV4cG9ydE1hcC5wYXJzZSA9IGZ1bmN0aW9uIChwYXRoLCBjb250ZW50LCBjb250ZXh0KSB7XG4gIHZhciBtID0gbmV3IEV4cG9ydE1hcChwYXRoKVxuXG4gIHRyeSB7XG4gICAgdmFyIGFzdCA9IHBhcnNlKHBhdGgsIGNvbnRlbnQsIGNvbnRleHQpXG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGxvZygncGFyc2UgZXJyb3I6JywgcGF0aCwgZXJyKVxuICAgIG0uZXJyb3JzLnB1c2goZXJyKVxuICAgIHJldHVybiBtIC8vIGNhbid0IGNvbnRpbnVlXG4gIH1cblxuICBpZiAoIXVuYW1iaWd1b3VzLmlzTW9kdWxlKGFzdCkpIHJldHVybiBudWxsXG5cbiAgY29uc3QgZG9jc3R5bGUgPSAoY29udGV4dC5zZXR0aW5ncyAmJiBjb250ZXh0LnNldHRpbmdzWydpbXBvcnQvZG9jc3R5bGUnXSkgfHwgWydqc2RvYyddXG4gIGNvbnN0IGRvY1N0eWxlUGFyc2VycyA9IHt9XG4gIGRvY3N0eWxlLmZvckVhY2goc3R5bGUgPT4ge1xuICAgIGRvY1N0eWxlUGFyc2Vyc1tzdHlsZV0gPSBhdmFpbGFibGVEb2NTdHlsZVBhcnNlcnNbc3R5bGVdXG4gIH0pXG5cbiAgLy8gYXR0ZW1wdCB0byBjb2xsZWN0IG1vZHVsZSBkb2NcbiAgYXN0LmNvbW1lbnRzLnNvbWUoYyA9PiB7XG4gICAgaWYgKGMudHlwZSAhPT0gJ0Jsb2NrJykgcmV0dXJuIGZhbHNlXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGRvYyA9IGRvY3RyaW5lLnBhcnNlKGMudmFsdWUsIHsgdW53cmFwOiB0cnVlIH0pXG4gICAgICBpZiAoZG9jLnRhZ3Muc29tZSh0ID0+IHQudGl0bGUgPT09ICdtb2R1bGUnKSkge1xuICAgICAgICBtLmRvYyA9IGRvY1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycikgeyAvKiBpZ25vcmUgKi8gfVxuICAgIHJldHVybiBmYWxzZVxuICB9KVxuXG4gIGNvbnN0IG5hbWVzcGFjZXMgPSBuZXcgTWFwKClcblxuICBmdW5jdGlvbiByZW1vdGVQYXRoKG5vZGUpIHtcbiAgICByZXR1cm4gcmVzb2x2ZS5yZWxhdGl2ZShub2RlLnNvdXJjZS52YWx1ZSwgcGF0aCwgY29udGV4dC5zZXR0aW5ncylcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc29sdmVJbXBvcnQobm9kZSkge1xuICAgIGNvbnN0IHJwID0gcmVtb3RlUGF0aChub2RlKVxuICAgIGlmIChycCA9PSBudWxsKSByZXR1cm4gbnVsbFxuICAgIHJldHVybiBFeHBvcnRNYXAuZm9yKHJwLCBjb250ZXh0KVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TmFtZXNwYWNlKGlkZW50aWZpZXIpIHtcbiAgICBpZiAoIW5hbWVzcGFjZXMuaGFzKGlkZW50aWZpZXIubmFtZSkpIHJldHVyblxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiByZXNvbHZlSW1wb3J0KG5hbWVzcGFjZXMuZ2V0KGlkZW50aWZpZXIubmFtZSkpXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gYWRkTmFtZXNwYWNlKG9iamVjdCwgaWRlbnRpZmllcikge1xuICAgIGNvbnN0IG5zZm4gPSBnZXROYW1lc3BhY2UoaWRlbnRpZmllcilcbiAgICBpZiAobnNmbikge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgJ25hbWVzcGFjZScsIHsgZ2V0OiBuc2ZuIH0pXG4gICAgfVxuXG4gICAgcmV0dXJuIG9iamVjdFxuICB9XG5cblxuICBhc3QuYm9keS5mb3JFYWNoKGZ1bmN0aW9uIChuKSB7XG5cbiAgICBpZiAobi50eXBlID09PSAnRXhwb3J0RGVmYXVsdERlY2xhcmF0aW9uJykge1xuICAgICAgY29uc3QgZXhwb3J0TWV0YSA9IGNhcHR1cmVEb2MoZG9jU3R5bGVQYXJzZXJzLCBuKVxuICAgICAgaWYgKG4uZGVjbGFyYXRpb24udHlwZSA9PT0gJ0lkZW50aWZpZXInKSB7XG4gICAgICAgIGFkZE5hbWVzcGFjZShleHBvcnRNZXRhLCBuLmRlY2xhcmF0aW9uKVxuICAgICAgfVxuICAgICAgbS5uYW1lc3BhY2Uuc2V0KCdkZWZhdWx0JywgZXhwb3J0TWV0YSlcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmIChuLnR5cGUgPT09ICdFeHBvcnRBbGxEZWNsYXJhdGlvbicpIHtcbiAgICAgIGxldCByZW1vdGVNYXAgPSByZW1vdGVQYXRoKG4pXG4gICAgICBpZiAocmVtb3RlTWFwID09IG51bGwpIHJldHVyblxuICAgICAgbS5kZXBlbmRlbmNpZXMuc2V0KHJlbW90ZU1hcCwgKCkgPT4gRXhwb3J0TWFwLmZvcihyZW1vdGVNYXAsIGNvbnRleHQpKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gY2FwdHVyZSBuYW1lc3BhY2VzIGluIGNhc2Ugb2YgbGF0ZXIgZXhwb3J0XG4gICAgaWYgKG4udHlwZSA9PT0gJ0ltcG9ydERlY2xhcmF0aW9uJykge1xuICAgICAgbGV0IG5zXG4gICAgICBpZiAobi5zcGVjaWZpZXJzLnNvbWUocyA9PiBzLnR5cGUgPT09ICdJbXBvcnROYW1lc3BhY2VTcGVjaWZpZXInICYmIChucyA9IHMpKSkge1xuICAgICAgICBuYW1lc3BhY2VzLnNldChucy5sb2NhbC5uYW1lLCBuKVxuICAgICAgfVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgaWYgKG4udHlwZSA9PT0gJ0V4cG9ydE5hbWVkRGVjbGFyYXRpb24nKXtcbiAgICAgIC8vIGNhcHR1cmUgZGVjbGFyYXRpb25cbiAgICAgIGlmIChuLmRlY2xhcmF0aW9uICE9IG51bGwpIHtcbiAgICAgICAgc3dpdGNoIChuLmRlY2xhcmF0aW9uLnR5cGUpIHtcbiAgICAgICAgICBjYXNlICdGdW5jdGlvbkRlY2xhcmF0aW9uJzpcbiAgICAgICAgICBjYXNlICdDbGFzc0RlY2xhcmF0aW9uJzpcbiAgICAgICAgICBjYXNlICdUeXBlQWxpYXMnOiAvLyBmbG93dHlwZSB3aXRoIGJhYmVsLWVzbGludCBwYXJzZXJcbiAgICAgICAgICAgIG0ubmFtZXNwYWNlLnNldChuLmRlY2xhcmF0aW9uLmlkLm5hbWUsIGNhcHR1cmVEb2MoZG9jU3R5bGVQYXJzZXJzLCBuKSlcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgY2FzZSAnVmFyaWFibGVEZWNsYXJhdGlvbic6XG4gICAgICAgICAgICBuLmRlY2xhcmF0aW9uLmRlY2xhcmF0aW9ucy5mb3JFYWNoKChkKSA9PlxuICAgICAgICAgICAgICByZWN1cnNpdmVQYXR0ZXJuQ2FwdHVyZShkLmlkLFxuICAgICAgICAgICAgICAgIGlkID0+IG0ubmFtZXNwYWNlLnNldChpZC5uYW1lLCBjYXB0dXJlRG9jKGRvY1N0eWxlUGFyc2VycywgZCwgbikpKSlcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbi5zcGVjaWZpZXJzLmZvckVhY2goKHMpID0+IHtcbiAgICAgICAgY29uc3QgZXhwb3J0TWV0YSA9IHt9XG4gICAgICAgIGxldCBsb2NhbFxuXG4gICAgICAgIHN3aXRjaCAocy50eXBlKSB7XG4gICAgICAgICAgY2FzZSAnRXhwb3J0RGVmYXVsdFNwZWNpZmllcic6XG4gICAgICAgICAgICBpZiAoIW4uc291cmNlKSByZXR1cm5cbiAgICAgICAgICAgIGxvY2FsID0gJ2RlZmF1bHQnXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIGNhc2UgJ0V4cG9ydE5hbWVzcGFjZVNwZWNpZmllcic6XG4gICAgICAgICAgICBtLm5hbWVzcGFjZS5zZXQocy5leHBvcnRlZC5uYW1lLCBPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0TWV0YSwgJ25hbWVzcGFjZScsIHtcbiAgICAgICAgICAgICAgZ2V0KCkgeyByZXR1cm4gcmVzb2x2ZUltcG9ydChuKSB9LFxuICAgICAgICAgICAgfSkpXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICBjYXNlICdFeHBvcnRTcGVjaWZpZXInOlxuICAgICAgICAgICAgaWYgKCFuLnNvdXJjZSkge1xuICAgICAgICAgICAgICBtLm5hbWVzcGFjZS5zZXQocy5leHBvcnRlZC5uYW1lLCBhZGROYW1lc3BhY2UoZXhwb3J0TWV0YSwgcy5sb2NhbCkpXG4gICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gZWxzZSBmYWxscyB0aHJvdWdoXG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGxvY2FsID0gcy5sb2NhbC5uYW1lXG4gICAgICAgICAgICBicmVha1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdG9kbzogSlNEb2NcbiAgICAgICAgbS5yZWV4cG9ydHMuc2V0KHMuZXhwb3J0ZWQubmFtZSwgeyBsb2NhbCwgZ2V0SW1wb3J0OiAoKSA9PiByZXNvbHZlSW1wb3J0KG4pIH0pXG4gICAgICB9KVxuICAgIH1cbiAgfSlcblxuICByZXR1cm4gbVxufVxuXG5cbi8qKlxuICogVHJhdmVyc2UgYSBwYXR0ZXJuL2lkZW50aWZpZXIgbm9kZSwgY2FsbGluZyAnY2FsbGJhY2snXG4gKiBmb3IgZWFjaCBsZWFmIGlkZW50aWZpZXIuXG4gKiBAcGFyYW0gIHtub2RlfSAgIHBhdHRlcm5cbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHJldHVybiB7dm9pZH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlY3Vyc2l2ZVBhdHRlcm5DYXB0dXJlKHBhdHRlcm4sIGNhbGxiYWNrKSB7XG4gIHN3aXRjaCAocGF0dGVybi50eXBlKSB7XG4gICAgY2FzZSAnSWRlbnRpZmllcic6IC8vIGJhc2UgY2FzZVxuICAgICAgY2FsbGJhY2socGF0dGVybilcbiAgICAgIGJyZWFrXG5cbiAgICBjYXNlICdPYmplY3RQYXR0ZXJuJzpcbiAgICAgIHBhdHRlcm4ucHJvcGVydGllcy5mb3JFYWNoKHAgPT4ge1xuICAgICAgICByZWN1cnNpdmVQYXR0ZXJuQ2FwdHVyZShwLnZhbHVlLCBjYWxsYmFjaylcbiAgICAgIH0pXG4gICAgICBicmVha1xuXG4gICAgY2FzZSAnQXJyYXlQYXR0ZXJuJzpcbiAgICAgIHBhdHRlcm4uZWxlbWVudHMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgICBpZiAoZWxlbWVudCA9PSBudWxsKSByZXR1cm5cbiAgICAgICAgcmVjdXJzaXZlUGF0dGVybkNhcHR1cmUoZWxlbWVudCwgY2FsbGJhY2spXG4gICAgICB9KVxuICAgICAgYnJlYWtcbiAgfVxufVxuIl19