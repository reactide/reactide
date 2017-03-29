#!/usr/bin/env node

var path = require("path");
var url = require("url");
var open = require("open");
var fs = require("fs");

// Local version replaces global one
try {
	var localWebpackDevServer = require.resolve(path.join(process.cwd(), "node_modules", "webpack-dev-server", "bin", "webpack-dev-server.js"));
	if(__filename !== localWebpackDevServer) {
		return require(localWebpackDevServer);
	}
} catch(e) {}

var Server = require("../lib/Server");
var webpack = require("webpack");

var yargs = require("yargs")
	.usage("webpack-dev-server " + require("../package.json").version + "\n" +
		"webpack " + require("webpack/package.json").version + "\n" +
		"Usage: http://webpack.github.io/docs/webpack-dev-server.html");

require("webpack/bin/config-yargs")(yargs);

var ADVANCED_GROUP = "Advanced options:";
var DISPLAY_GROUP = "Stats options:";
var SSL_GROUP = "SSL options:";
var CONNECTION_GROUP = "Connection options:";
var RESPONSE_GROUP = "Response options:";

yargs.options({
	"lazy": {
		type: "boolean",
		describe: "Lazy"
	},
	"inline": {
		type: "boolean",
		default: true,
		describe: "Inline mode"
	},
	"hot-only": {
		type: "boolean",
		describe: "Do not refresh page if HMR fails",
		group: ADVANCED_GROUP
	},
	"stdin": {
		type: "boolean",
		describe: "close when stdin ends"
	},
	"open": {
		type: "boolean",
		describe: "Open default browser"
	},
	"info": {
		type: "boolean",
		group: DISPLAY_GROUP,
		default: true,
		describe: "Info"
	},
	"quiet": {
		type: "boolean",
		group: DISPLAY_GROUP,
		describe: "Quiet"
	},
	"https": {
		type: "boolean",
		group: SSL_GROUP,
		describe: "HTTPS"
	},
	"key": {
		type: "string",
		describe: "Path to a SSL key.",
		group: SSL_GROUP
	},
	"cert": {
		type: "string",
		describe: "Path to a SSL certificate.",
		group: SSL_GROUP
	},
	"cacert": {
		type: "string",
		describe: "Path to a SSL CA certificate.",
		group: SSL_GROUP
	},
	"content-base": {
		type: "string",
		describe: "A directory or URL to serve HTML content from.",
		group: RESPONSE_GROUP
	},
	"history-api-fallback": {
		type: "boolean",
		describe: "Fallback to /index.html for Single Page Applications.",
		group: RESPONSE_GROUP
	},
	"compress": {
		type: "boolean",
		describe: "Enable gzip compression",
		group: RESPONSE_GROUP
	},
	"port": {
		describe: "The port",
		default: 8080,
		group: CONNECTION_GROUP
	},
	"public": {
		type: "string",
		describe: "The public hostname/ip address of the server",
		group: CONNECTION_GROUP
	},
	"host": {
		type: "string",
		default: "localhost",
		describe: "The hostname/ip address the server will bind to",
		group: CONNECTION_GROUP
	}
});

var argv = yargs.argv;

var wpOpt = require("webpack/bin/convert-argv")(yargs, argv, {
	outputFilename: "/bundle.js"
});

function processOptions(wpOpt) {
	//process Promise
	if(typeof wpOpt.then === "function") {
		wpOpt.then(processOptions).catch(function(err) {
			console.error(err.stack || err);
			process.exit(); // eslint-disable-line
		});
		return;
	}

	var firstWpOpt = Array.isArray(wpOpt) ? wpOpt[0] : wpOpt;

	var options = wpOpt.devServer || firstWpOpt.devServer || {};

	if(argv.host !== "localhost" || !options.host)
		options.host = argv.host;

	if(argv.public)
		options.public = argv.public;

	if(argv.port !== 8080 || !options.port)
		options.port = argv.port;

	if(!options.publicPath) {
		options.publicPath = firstWpOpt.output && firstWpOpt.output.publicPath || "";
		if(!/^(https?:)?\/\//.test(options.publicPath) && options.publicPath[0] !== "/")
			options.publicPath = "/" + options.publicPath;
	}

	if(!options.outputPath)
		options.outputPath = "/";
	if(!options.filename)
		options.filename = firstWpOpt.output && firstWpOpt.output.filename;
	[].concat(wpOpt).forEach(function(wpOpt) {
		wpOpt.output.path = "/";
	});

	if(!options.watchOptions)
		options.watchOptions = firstWpOpt.watchOptions;

	if(argv["stdin"]) {
		process.stdin.on('end', function() {
			process.exit(0);
		});
		process.stdin.resume();
	}

	if(!options.watchDelay && !options.watchOptions) // TODO remove in next major version
		options.watchDelay = firstWpOpt.watchDelay;

	if(!options.hot)
		options.hot = argv["hot"];

	if(!options.hotOnly)
		options.hotOnly = argv["hot-only"];

	if(argv["content-base"]) {
		options.contentBase = argv["content-base"];
		if(/^[0-9]$/.test(options.contentBase))
			options.contentBase = +options.contentBase;
		else if(!/^(https?:)?\/\//.test(options.contentBase))
			options.contentBase = path.resolve(options.contentBase);
	} else if(argv["content-base-target"]) {
		options.contentBase = {
			target: argv["content-base-target"]
		};
	} else if(!options.contentBase) {
		options.contentBase = process.cwd();
	}

	if(!options.stats) {
		options.stats = {
			cached: false,
			cachedAssets: false
		};
	}

	if(typeof options.stats === "object" && typeof options.stats.colors === "undefined")
		options.stats.colors = require("supports-color");

	if(argv["lazy"])
		options.lazy = true;

	if(!argv["info"])
		options.noInfo = true;

	if(argv["quiet"])
		options.quiet = true;

	if(argv["https"])
		options.https = true;

	if(argv["cert"])
		options.cert = fs.readFileSync(path.resolve(argv["cert"]));

	if(argv["key"])
		options.key = fs.readFileSync(path.resolve(argv["key"]));

	if(argv["cacert"])
		options.cacert = fs.readFileSync(path.resolve(argv["cacert"]));

	if(argv["inline"] === false)
		options.inline = false;

	if(argv["history-api-fallback"])
		options.historyApiFallback = true;

	if(argv["compress"])
		options.compress = true;

	if(argv["open"])
		options.open = true;

	var protocol = options.https ? "https" : "http";

	if(options.inline !== false) {
		var devClient = [require.resolve("../client/") + "?" + protocol + "://" + (options.public || (options.host + ":" + options.port))];

		if(options.hotOnly)
			devClient.push("webpack/hot/only-dev-server");
		else if(options.hot)
			devClient.push("webpack/hot/dev-server");

		[].concat(wpOpt).forEach(function(wpOpt) {
			if(typeof wpOpt.entry === "object" && !Array.isArray(wpOpt.entry)) {
				Object.keys(wpOpt.entry).forEach(function(key) {
					wpOpt.entry[key] = devClient.concat(wpOpt.entry[key]);
				});
			} else {
				wpOpt.entry = devClient.concat(wpOpt.entry);
			}
		});
	}

	new Server(webpack(wpOpt), options).listen(options.port, options.host, function(err) {
		if(err) throw err;

		var uri = protocol + "://" + options.host + ":" + options.port + "/";
		if(options.inline === false)
			uri += "webpack-dev-server/";
		console.log(" " + uri);

		console.log("webpack result is served from " + options.publicPath);
		if(Array.isArray(options.contentBase))
			console.log("content is served from " + options.contentBase.join(", "));
		else if(typeof options.contentBase === "object")
			console.log("requests are proxied to " + options.contentBase.target);
		else
			console.log("content is served from " + options.contentBase);
		if(options.historyApiFallback)
			console.log("404s will fallback to %s", options.historyApiFallback.index || "/index.html");
		if(options.open)
			open(uri);
	});
}

processOptions(wpOpt);
