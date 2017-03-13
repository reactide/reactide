const assign = require('object-assign')
const arrify = require('arrify')
const micromatch = require('micromatch')
const path = require('path')
const readPkgUp = require('read-pkg-up')
const requireMainFilename = require('require-main-filename')

function TestExclude (opts) {
  assign(this, {
    cwd: process.cwd(),
    include: false,
    configKey: null, // the key to load config from in package.json.
    configPath: null, // optionally override requireMainFilename.
    configFound: false
  }, opts)

  if (typeof this.include === 'string') this.include = [this.include]
  if (typeof this.exclude === 'string') this.exclude = [this.exclude]

  if (!this.include && !this.exclude && this.configKey) {
    assign(this, this.pkgConf(this.configKey, this.configPath))
  }

  if (!this.exclude || !Array.isArray(this.exclude)) {
    this.exclude = exportFunc.defaultExclude
  }

  if (this.include && this.include.length > 0) {
    this.include = prepGlobPatterns(arrify(this.include))
  } else {
    this.include = false
  }

  if (!this.removeNegatedModuleExclude() && this.exclude.indexOf('**/node_modules/**') === -1) {
    this.exclude.push('**/node_modules/**')
  }

  this.exclude = prepGlobPatterns(
    [].concat(arrify(this.exclude))
  )
}

// if a glob has been provided that explicitly negates
// the **/node_modules/** default exclude rule, remove it from
// excludes but don't add the default exclude rule.
TestExclude.prototype.removeNegatedModuleExclude = function () {
  var moduleExcludeNegated = false
  this.exclude = this.exclude.filter(function (e) {
    var negated = !!micromatch('./node_modules/foo.js', e, {nonegate: false}).length !==
      !!micromatch('./node_modules/foo.js', e, {nonegate: true}).length
    if (negated) moduleExcludeNegated = true
    return !negated
  })
  return moduleExcludeNegated
}

TestExclude.prototype.shouldInstrument = function (filename, relFile) {
  relFile = relFile || path.relative(this.cwd, filename)

  // Don't instrument files that are outside of the current working directory.
  if (/^\.\./.test(path.relative(this.cwd, filename))) return false

  relFile = relFile.replace(/^\.[\\\/]/, '') // remove leading './' or '.\'.
  return (!this.include || micromatch.any(relFile, this.include, {dotfiles: true})) && !micromatch.any(relFile, this.exclude, {dotfiles: true})
}

TestExclude.prototype.pkgConf = function (key, path) {
  const obj = readPkgUp.sync({
    cwd: path || requireMainFilename(require)
  })

  if (obj.pkg && obj.pkg[key] && typeof obj.pkg[key] === 'object') {
    this.configFound = true
    return obj.pkg[key]
  } else {
    return {}
  }
}

function prepGlobPatterns (patterns) {
  return patterns.reduce(function (result, pattern) {
    // Allow gitignore style of directory exclusion
    if (!/\/\*\*$/.test(pattern)) {
      result = result.concat(pattern.replace(/\/$/, '') + '/**')
    }

    // Any rules of the form **/foo.js, should also match foo.js.
    if (/^\*\*\//.test(pattern)) {
      result = result.concat(pattern.replace(/^\*\*\//, ''))
    }

    return result.concat(pattern)
  }, [])
}

var exportFunc = function (opts) {
  return new TestExclude(opts)
}

exportFunc.defaultExclude = [
  'test/**',
  'test{,-*}.js',
  '**/*.test.js',
  '**/__tests__/**',
  '**/node_modules/**'
]

module.exports = exportFunc
