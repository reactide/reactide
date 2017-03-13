'use strict';
/*jshint asi: true*/

var test = require('tap').test
  , util = require('util')
  , redeyed = require('..')

function inspect (obj) {
  return util.inspect(obj, false, 5, true)
}

test('adding custom asserts ... ', function (t) {
  t.constructor.prototype.assertSurrounds = function (code, opts, expected) {
    var optsi = inspect(opts);
    var result = redeyed(code, opts).code

    this.equals(  result
                , expected
                , util.format('%s: %s => %s', optsi, inspect(code), inspect(expected))
               )
    return this;
  }

  t.end()
})

test('incomplete statement', function (t) {
  t.test('\n# Keyword', function (t) {
    var keyconfig = { 'Keyword': { _default: '$:%' } };
    t.assertSurrounds('if(foo) { x', keyconfig, '$if%(foo) { x')
    t.assertSurrounds('class Foo { constructor(name)', keyconfig, '$class% Foo { constructor(name)')
    t.assertSurrounds('const x = ', keyconfig, '$const% x = ')
    t.assertSurrounds('function g() { yield', keyconfig, '$function% g() { $yield%')
    t.end()
  })

  t.end()
})
