/* global describe, it, context */

const exclude = require('../')

require('chai').should()

describe('testExclude', function () {
  it('should exclude the node_modules folder by default', function () {
    exclude().shouldInstrument('./banana/node_modules/cat.js').should.equal(false)
    exclude().shouldInstrument('node_modules/cat.js').should.equal(false)
  })

  it('ignores ./', function () {
    exclude().shouldInstrument('./test.js').should.equal(false)
    exclude().shouldInstrument('./foo.test.js').should.equal(false)
  })

  it('matches files in root with **/', function () {
    exclude().shouldInstrument('__tests__/**').should.equal(false)
  })

  it('does not instrument files outside cwd', function () {
    exclude().shouldInstrument('../foo.js').should.equal(false)
  })

  it('applies exclude rule ahead of include rule', function () {
    const e = exclude({
      include: ['test.js', 'foo.js'],
      exclude: ['test.js']
    })
    e.shouldInstrument('test.js').should.equal(false)
    e.shouldInstrument('foo.js').should.equal(true)
    e.shouldInstrument('banana.js').should.equal(false)
  })

  it('should handle gitignore-style excludes', function () {
    const e = exclude({
      exclude: ['dist']
    })

    e.shouldInstrument('dist/foo.js').should.equal(false)
    e.shouldInstrument('dist/foo/bar.js').should.equal(false)
    e.shouldInstrument('src/foo.js').should.equal(true)
  })

  it('should handle gitignore-style includes', function () {
    const e = exclude({
      include: ['src']
    })

    e.shouldInstrument('src/foo.test.js').should.equal(false)
    e.shouldInstrument('src/foo.js').should.equal(true)
    e.shouldInstrument('src/foo/bar.js').should.equal(true)
  })

  it("handles folder '.' in path", function () {
    const e = exclude()
    e.shouldInstrument('test/fixtures/basic/.next/dist/pages/async-props.js').should.equal(false)
  })

  it('excludes node_modules folder, even when empty exclude group is provided', function () {
    const e = exclude({
      exclude: []
    })

    e.shouldInstrument('./banana/node_modules/cat.js').should.equal(false)
    e.shouldInstrument('node_modules/some/module/to/cover.js').should.equal(false)
    e.shouldInstrument('__tests__/a-test.js').should.equal(true)
    e.shouldInstrument('src/a.test.js').should.equal(true)
    e.shouldInstrument('src/foo.js').should.equal(true)
  })

  it('allows node_modules folder to be included, if !node_modules is explicitly provided', function () {
    const e = exclude({
      exclude: ['!**/node_modules/**']
    })

    e.shouldInstrument('./banana/node_modules/cat.js').should.equal(true)
    e.shouldInstrument('node_modules/some/module/to/cover.js').should.equal(true)
    e.shouldInstrument('__tests__/a-test.js').should.equal(true)
    e.shouldInstrument('src/a.test.js').should.equal(true)
    e.shouldInstrument('src/foo.js').should.equal(true)
  })

  it('exports defaultExclude', function () {
    exclude.defaultExclude.should.deep.equal([
      'test/**',
      'test{,-*}.js',
      '**/*.test.js',
      '**/__tests__/**',
      '**/node_modules/**'
    ])
  })

  describe('pkgConf', function () {
    it('should load exclude rules from config key', function () {
      const e = exclude({
        configPath: './test/fixtures/exclude',
        configKey: 'a'
      })

      e.shouldInstrument('foo.js').should.equal(true)
      e.shouldInstrument('batman.js').should.equal(false)
      e.configFound.should.equal(true)
    })

    it('should load include rules from config key', function () {
      const e = exclude({
        configPath: './test/fixtures/include',
        configKey: 'b'
      })

      e.shouldInstrument('foo.js').should.equal(false)
      e.shouldInstrument('batman.js').should.equal(true)
      e.configFound.should.equal(true)
    })

    it('should only instrument files that are included in subdirs', function () {
      const e = exclude({
        configPath: './test/fixtures/include-src-only',
        configKey: 'c'
      })
      e.shouldInstrument('bar/baz.js').should.equal(false)
      e.shouldInstrument('bad/file.js').should.equal(false)
      e.shouldInstrument('foo.js').should.equal(false)

      e.shouldInstrument('src/app.test.js').should.equal(false)
      e.shouldInstrument('src/app.js').should.equal(true)
    })

    it('should respect defaultExcludes if no config is given', function () {
      const e = exclude({
        configPath: './test/fixtures/defaults',
        configKey: 'd'
      })

      e.shouldInstrument('test.js').should.equal(false)
      e.shouldInstrument('src/app.test.js').should.equal(false)

      e.shouldInstrument('bar/baz.js').should.equal(true)
      e.shouldInstrument('bad/file.js').should.equal(true)
      e.shouldInstrument('foo.js').should.equal(true)
      e.shouldInstrument('index.js').should.equal(true)
    })

    it('should not throw if a key is missing', function () {
      var e = exclude({
        configPath: './test/fixtures/include',
        configKey: 'c'
      })
      e.configFound.should.equal(false)
    })

    context('when given an object', function () {
      it('should use the defaultExcludes if the object is empty', function () {
        const e = exclude({
          configPath: './test/fixtures/exclude-empty-object',
          configKey: 'e'
        })

        e.shouldInstrument('test.js').should.equal(false)
        e.shouldInstrument('src/app.test.js').should.equal(false)

        e.shouldInstrument('bar/baz.js').should.equal(true)
        e.shouldInstrument('bad/file.js').should.equal(true)
        e.shouldInstrument('foo.js').should.equal(true)
        e.shouldInstrument('index.js').should.equal(true)
      })

      it('should use the defaultExcludes if the object is not empty', function () {
        const e = exclude({
          configPath: './test/fixtures/exclude-object',
          configKey: 'e'
        })

        e.shouldInstrument('test.js').should.equal(false)
        e.shouldInstrument('src/app.test.js').should.equal(false)

        e.shouldInstrument('bar/baz.js').should.equal(true)
        e.shouldInstrument('bad/file.js').should.equal(true)
        e.shouldInstrument('foo.js').should.equal(true)
        e.shouldInstrument('index.js').should.equal(true)
      })
    })
  })

  // see: https://github.com/istanbuljs/babel-plugin-istanbul/issues/71
  it('allows exclude/include rule to be a string', function () {
    const e = exclude({
      exclude: 'src/**/*.spec.js',
      include: 'src/**'
    })
    e.shouldInstrument('src/batman/robin/foo.spec.js').should.equal(false)
    e.shouldInstrument('src/batman/robin/foo.js').should.equal(true)
  })
})
