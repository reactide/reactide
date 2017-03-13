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

test('upcoming syntax: rest and spread properties', function (t) {

  t.test('\n# Punctuator', function (t) {
    var punctuator = { 'Punctuator': { _default: '$:%' } };
    t.assertSurrounds('{a,...b} = c', punctuator, '${%a$,%$...%b$}% $=% c')
    t.assertSurrounds('x={y,...z}', punctuator, 'x$=%${%y$,%$...%z$}%')
    t.assertSurrounds('x ** y', punctuator, 'x $**% y');
    t.assertSurrounds('x **= y', punctuator, 'x $**=% y');
    t.end()
  })

  t.test('\n# Identifier', function (t) {
    var identifier = { 'Identifier': { _default: '$:%' } };
    t.assertSurrounds('{a,...b} = c', identifier, '{$a%,...$b%} = $c%')
    t.assertSurrounds('x={y,...z}', identifier, '$x%={$y%,...$z%}')
    t.end()
  })

  t.end()
})
