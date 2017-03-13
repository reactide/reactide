var assert = require("assert");
var fs = require("fs");
var path = require("path");
var exec = require('child_process').exec;
var webpack = require("webpack");

var CaseSensitivePathsPlugin = require("../");

describe("CaseSensitivePathsPlugin", function() {

    it("should compile and warn on wrong filename case", function(done) {
        webpack({
            context: path.join(__dirname, "fixtures", "wrong-case"),
            target: "node",
            output: {
                path: path.join(__dirname, "js"),
                filename: "result.js",
            },
            entry: "./entry",
            plugins: [
                new CaseSensitivePathsPlugin()
            ]
        }, function(err, stats) {
            if (err) done(err);
            assert(stats.hasErrors());
            assert.equal(stats.hasWarnings(), false);
            var jsonStats = stats.toJson();
            assert.equal(jsonStats.errors.length, 1);

            var error = jsonStats.errors[0].split("\n");
            // check that the plugin produces the correct output
            assert(error[1].indexOf('[CaseSensitivePathsPlugin]') > -1);
            assert(error[1].indexOf('TestFile.js') > -1); // wrong file require
            assert(error[1].indexOf('testfile.js') > -1); // actual file name

            done();
        });
    });

    it("should handle the deletion of a folder", function(done) {
        var compiler = webpack({
            context: path.join(__dirname, "fixtures", "deleting-folder"),
            target: "node",
            output: {
                path: path.join(__dirname, "js"),
                filename: "result.js",
            },
            entry: "./entry",
            plugins: [
                new CaseSensitivePathsPlugin()
            ]
        });

        // create folder and file to be deleted
        var testFolder = path.join(__dirname, "fixtures", "deleting-folder", "test-folder");
        fs.mkdirSync(testFolder);
        fs.writeFileSync(path.join(testFolder, "testfile.js"), "module.exports = '';");

        var watchCount = 0;
        var watcher = compiler.watch({ poll: true }, function(err, stats) {
            if (err) done(err);
            watchCount++;

            if (watchCount === 1) {
                assert.equal(stats.hasErrors(), false);
                assert.equal(stats.hasWarnings(), false);

                // wait for things to settle
                setTimeout(function() {
                    // after initial compile delete test folder
                    exec("rm -r " + testFolder, function(err) { if (err) done(err); });
                }, 100);
                return;
            }

            if (watchCount === 2) {
                assert(stats.hasErrors());
                assert.equal(stats.hasWarnings(), false);

                var jsonStats = stats.toJson();
                assert.equal(jsonStats.errors.length, 1);

                watcher.close(done);
                return;
            }

            throw Error("Shouldn't be here...");
        });
    });
});
