var path = require('path');
var test = require('tape');
var resolve = require('../');

test('async foo', function (t) {
    t.plan(10);
    var dir = path.join(__dirname, 'resolver');

    resolve('./foo', { basedir: dir }, function (err, res, pkg) {
        if (err) t.fail(err);
        t.equal(res, path.join(dir, 'foo.js'));
        t.equal(pkg.name, 'resolve');
    });

    resolve('./foo.js', { basedir: dir }, function (err, res, pkg) {
        if (err) t.fail(err);
        t.equal(res, path.join(dir, 'foo.js'));
        t.equal(pkg.name, 'resolve');
    });

    resolve('./foo', { basedir: dir, 'package': { main: 'resolver' } }, function (err, res, pkg) {
        if (err) t.fail(err);
        t.equal(res, path.join(dir, 'foo.js'));
        t.equal(pkg.main, 'resolver');
    });

    resolve('./foo.js', { basedir: dir, 'package': { main: 'resolver' } }, function (err, res, pkg) {
        if (err) t.fail(err);
        t.equal(res, path.join(dir, 'foo.js'));
        t.equal(pkg.main, 'resolver');
    });

    resolve('foo', { basedir: dir }, function (err) {
        t.equal(err.message, "Cannot find module 'foo' from '" + path.resolve(dir) + "'");
        t.equal(err.code, 'MODULE_NOT_FOUND');
    });
});

test('bar', function (t) {
    t.plan(6);
    var dir = path.join(__dirname, 'resolver');

    resolve('foo', { basedir: dir + '/bar' }, function (err, res, pkg) {
        if (err) t.fail(err);
        t.equal(res, path.join(dir, 'bar/node_modules/foo/index.js'));
        t.equal(pkg, undefined);
    });

    resolve('foo', { basedir: dir + '/bar' }, function (err, res, pkg) {
        if (err) t.fail(err);
        t.equal(res, path.join(dir, 'bar/node_modules/foo/index.js'));
        t.equal(pkg, undefined);
    });

    resolve('foo', { basedir: dir + '/bar', 'package': { main: 'bar' } }, function (err, res, pkg) {
        if (err) t.fail(err);
        t.equal(res, path.join(dir, 'bar/node_modules/foo/index.js'));
        t.equal(pkg, undefined);
    });
});

test('baz', function (t) {
    t.plan(4);
    var dir = path.join(__dirname, 'resolver');

    resolve('./baz', { basedir: dir }, function (err, res, pkg) {
        if (err) t.fail(err);
        t.equal(res, path.join(dir, 'baz/quux.js'));
        t.equal(pkg.main, 'quux.js');
    });

    resolve('./baz', { basedir: dir, 'package': { main: 'resolver' } }, function (err, res, pkg) {
        if (err) t.fail(err);
        t.equal(res, path.join(dir, 'baz/quux.js'));
        t.equal(pkg.main, 'quux.js');
    });
});

test('biz', function (t) {
    t.plan(24);
    var dir = path.join(__dirname, 'resolver/biz/node_modules');

    resolve('./grux', { basedir: dir }, function (err, res, pkg) {
        if (err) t.fail(err);
        t.equal(res, path.join(dir, 'grux/index.js'));
        t.equal(pkg, undefined);
    });

    resolve('./grux', { basedir: dir, 'package': { main: 'biz' } }, function (err, res, pkg) {
        if (err) t.fail(err);
        t.equal(res, path.join(dir, 'grux/index.js'));
        t.equal(pkg.main, 'biz');
    });

    resolve('./garply', { basedir: dir }, function (err, res, pkg) {
        if (err) t.fail(err);
        t.equal(res, path.join(dir, 'garply/lib/index.js'));
        t.equal(pkg.main, './lib');
    });

    resolve('./garply', { basedir: dir, 'package': { main: 'biz' } }, function (err, res, pkg) {
        if (err) t.fail(err);
        t.equal(res, path.join(dir, 'garply/lib/index.js'));
        t.equal(pkg.main, './lib');
    });

    resolve('tiv', { basedir: dir + '/grux' }, function (err, res, pkg) {
        if (err) t.fail(err);
        t.equal(res, path.join(dir, 'tiv/index.js'));
        t.equal(pkg, undefined);
    });

    resolve('tiv', { basedir: dir + '/grux', 'package': { main: 'grux' } }, function (err, res, pkg) {
        if (err) t.fail(err);
        t.equal(res, path.join(dir, 'tiv/index.js'));
        t.equal(pkg, undefined);
    });

    resolve('tiv', { basedir: dir + '/garply' }, function (err, res, pkg) {
        if (err) t.fail(err);
        t.equal(res, path.join(dir, 'tiv/index.js'));
        t.equal(pkg, undefined);
    });

    resolve('tiv', { basedir: dir + '/garply', 'package': { main: './lib' } }, function (err, res, pkg) {
        if (err) t.fail(err);
        t.equal(res, path.join(dir, 'tiv/index.js'));
        t.equal(pkg, undefined);
    });

    resolve('grux', { basedir: dir + '/tiv' }, function (err, res, pkg) {
        if (err) t.fail(err);
        t.equal(res, path.join(dir, 'grux/index.js'));
        t.equal(pkg, undefined);
    });

    resolve('grux', { basedir: dir + '/tiv', 'package': { main: 'tiv' } }, function (err, res, pkg) {
        if (err) t.fail(err);
        t.equal(res, path.join(dir, 'grux/index.js'));
        t.equal(pkg, undefined);
    });

    resolve('garply', { basedir: dir + '/tiv' }, function (err, res, pkg) {
        if (err) t.fail(err);
        t.equal(res, path.join(dir, 'garply/lib/index.js'));
        t.equal(pkg.main, './lib');
    });

    resolve('garply', { basedir: dir + '/tiv', 'package': { main: 'tiv' } }, function (err, res, pkg) {
        if (err) t.fail(err);
        t.equal(res, path.join(dir, 'garply/lib/index.js'));
        t.equal(pkg.main, './lib');
    });
});

test('quux', function (t) {
    t.plan(2);
    var dir = path.join(__dirname, 'resolver/quux');

    resolve('./foo', { basedir: dir, 'package': { main: 'quux' } }, function (err, res, pkg) {
        if (err) t.fail(err);
        t.equal(res, path.join(dir, 'foo/index.js'));
        t.equal(pkg.main, 'quux');
    });
});

test('normalize', function (t) {
    t.plan(2);
    var dir = path.join(__dirname, 'resolver/biz/node_modules/grux');

    resolve('../grux', { basedir: dir }, function (err, res, pkg) {
        if (err) t.fail(err);
        t.equal(res, path.join(dir, 'index.js'));
        t.equal(pkg, undefined);
    });
});

test('cup', function (t) {
    t.plan(4);
    var dir = path.join(__dirname, 'resolver');

    resolve('./cup', { basedir: dir, extensions: ['.js', '.coffee'] }, function (err, res) {
        if (err) t.fail(err);
        t.equal(res, path.join(dir, 'cup.coffee'));
    });

    resolve('./cup.coffee', { basedir: dir }, function (err, res) {
        if (err) t.fail(err);
        t.equal(res, path.join(dir, 'cup.coffee'));
    });

    resolve('./cup', { basedir: dir, extensions: ['.js'] }, function (err, res) {
        t.equal(err.message, "Cannot find module './cup' from '" + path.resolve(dir) + "'");
        t.equal(err.code, 'MODULE_NOT_FOUND');
    });
});

test('mug', function (t) {
    t.plan(3);
    var dir = path.join(__dirname, 'resolver');

    resolve('./mug', { basedir: dir }, function (err, res) {
        if (err) t.fail(err);
        t.equal(res, path.join(dir, 'mug.js'));
    });

    resolve('./mug', { basedir: dir, extensions: ['.coffee', '.js'] }, function (err, res) {
        if (err) t.fail(err);
        t.equal(res, path.join(dir, '/mug.coffee'));
    });

    resolve('./mug', { basedir: dir, extensions: ['.js', '.coffee'] }, function (err, res) {
        t.equal(res, path.join(dir, '/mug.js'));
    });
});

test('other path', function (t) {
    t.plan(6);
    var resolverDir = path.join(__dirname, 'resolver');
    var dir = path.join(resolverDir, 'bar');
    var otherDir = path.join(resolverDir, 'other_path');

    resolve('root', { basedir: dir, paths: [otherDir] }, function (err, res) {
        if (err) t.fail(err);
        t.equal(res, path.join(resolverDir, 'other_path/root.js'));
    });

    resolve('lib/other-lib', { basedir: dir, paths: [otherDir] }, function (err, res) {
        if (err) t.fail(err);
        t.equal(res, path.join(resolverDir, 'other_path/lib/other-lib.js'));
    });

    resolve('root', { basedir: dir }, function (err, res) {
        t.equal(err.message, "Cannot find module 'root' from '" + path.resolve(dir) + "'");
        t.equal(err.code, 'MODULE_NOT_FOUND');
    });

    resolve('zzz', { basedir: dir, paths: [otherDir] }, function (err, res) {
        t.equal(err.message, "Cannot find module 'zzz' from '" + path.resolve(dir) + "'");
        t.equal(err.code, 'MODULE_NOT_FOUND');
    });
});

test('incorrect main', function (t) {
    t.plan(1);

    var resolverDir = path.join(__dirname, 'resolver');
    var dir = path.join(resolverDir, 'incorrect_main');

    resolve('./incorrect_main', { basedir: resolverDir }, function (err, res, pkg) {
        if (err) t.fail(err);
        t.equal(res, path.join(dir, 'index.js'));
    });
});

test('without basedir', function (t) {
    t.plan(1);

    var dir = path.join(__dirname, 'resolver/without_basedir');
    var tester = require(path.join(dir, 'main.js'));

    tester(t, function (err, res, pkg) {
        if (err) {
            t.fail(err);
        } else {
            t.equal(res, path.join(dir, 'node_modules/mymodule.js'));
        }
    });
});

test('#25: node modules with the same name as node stdlib modules', function (t) {
    t.plan(1);

    var resolverDir = path.join(__dirname, 'resolver/punycode');

    resolve('punycode', { basedir: resolverDir }, function (err, res, pkg) {
        if (err) t.fail(err);
        t.equal(res, path.join(resolverDir, 'node_modules/punycode/index.js'));
    });
});
