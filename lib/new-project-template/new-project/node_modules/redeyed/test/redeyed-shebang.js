'use strict';
/*jshint asi: true*/

var test = require('tap').test
  , util = require('util')
  , redeyed = require('..')

function inspect (obj) {
  return util.inspect(obj, false, 5, true)
}

test('preserves shebang', function (t) {
  var code = [
        '#!/usr/bin/env node'
      , 'var util = require("util");'
      ].join('\n')
    , opts = { Keyword: { 'var': '%:^' } }
    , expected = [
        '#!/usr/bin/env node'
      , '%var^ util = require("util");'
      ].join('\n')
    , res = redeyed(code, opts).code

  t.equals(res, expected, inspect(code) + ' opts: ' + inspect(opts) + ' => ' + inspect(expected))
  t.end()
})
