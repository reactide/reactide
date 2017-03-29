var StreamCache = require('..');
var assert      = require('assert');
var spawn       = require('child_process').spawn;

var source = spawn('cat');
var cache  = new StreamCache();

var dests = {};
var dataEvents = {};
['a', 'b', 'c'].forEach(function(name) {
  var dest         = dests[name] = spawn('cat');
  dataEvents[name] = [];

  dest.stdout.setEncoding('utf-8');
  dest.stdout.on('data', function(chunk) {
    dataEvents[name].push(chunk);
  });
});

cache.pipe(dests.a.stdin);
source.stdout.pipe(cache);
source.stdin.write('Hello');

source.stdout.once('data', function() {
  cache.pipe(dests.b.stdin);

  source.stdin.write('World');
  source.stdin.end();
});

source.on('exit', function() {
  cache.pipe(dests.c.stdin);
});

process.on('exit', function() {
  var expected    = ['Hello', 'World'];
  var alternative = ['HelloWorld'];

  assert.deepEqual(dataEvents.a, expected);

  try{
    assert.deepEqual(dataEvents.b, expected);
  } catch (err) {
    assert.deepEqual(dataEvents.b, alternative);
  }

  try{
    assert.deepEqual(dataEvents.c, expected);
  } catch (err) {
    assert.deepEqual(dataEvents.c, alternative);
  }
});
