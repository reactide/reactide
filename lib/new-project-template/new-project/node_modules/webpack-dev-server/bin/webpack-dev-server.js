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

var optimist = require("optimist")

.usage("webpack-dev-server " + require("../package.json").version + "\n" +
	"Usage: http://webpack.github.io/docs/webpack-dev-server.html")

.boolean("lazy").describe("lazy")

.boolean("stdin").describe("stdin", "close when stdin ends")

.boolean("info").describe("info").default("info", true)

.boolean("quiet").describe("quiet")

.boolean("inline").describe("inline", "Inline the webpack-dev-server logic into the bundle.")

.boolean("https").describe("https")

.string("key").describe("key", "Path to a SSL key.")

.string("cert").describe("cert", "Path to a SSL certificate.")

.string("cacert").describe("cacert", "Path to a SSL CA certificate.")

.string("pfx").describe("pfx", "Path to a SSL pfx file.")

.string("pfx-passphrase").describe("pfx-passphrase", "Passphrase for pfx file.")

.string("content-base").describe("content-base", "A directory or URL to serve HTML content from.")

.string("content-base-target").describe("content-base-target", "Proxy requests to this target.")

.boolean("history-api-fallback").describe("history-api-fallback", "Fallback to /index.html for Single Page Applications.")

.string("client-log-level").describe("client-log-level", "Log level in the browser (info, warning, error or none)").default("client-log-level", "info")

.boolean("compress").describe("compress", "enable gzip compression")

.boolean("open").describe("open", "Open default browser")

.describe("port", "The port").default("port", 8080)

.describe("public", "The public hostname/ip address of the server")

.describe("host", "The hostname/ip address the server will bind to").default("host", "localhost");

require("webpack/bin/config-optimist")(optimist);

var argv = optimist.argv;

var wpOpt = require("webpack/bin/convert-argv")(optimist, argv, {
	outputFilename: "/bundle.js"
});
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
		process.exit(0); // eslint-disable-line no-process-exit
	});
	process.stdin.resume();
}

if(!options.watchDelay && !options.watchOptions) // TODO remove in next major version
	options.watchDelay = firstWpOpt.watchDelay;

if(!options.hot)
	options.hot = argv["hot"];

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
	options.ca = fs.readFileSync(path.resolve(argv["cacert"]));

if(argv["pfx"])
	options.pfx = fs.readFileSync(path.resolve(argv["pfx"]));

if(argv["pfx-passphrase"])
	options.pfxPassphrase = argv["pfx-passphrase"];

if(argv["inline"])
	options.inline = true;

if(argv["history-api-fallback"])
	options.historyApiFallback = true;

if(argv["client-log-level"])
	options.clientLogLevel = argv["client-log-level"];

if(argv["compress"])
	options.compress = true;

if(argv["open"])
	options.open = true;

var protocol = options.https ? "https" : "http";

if(options.inline) {
	var devClient = [require.resolve("../client/") + "?" + protocol + "://" + (options.public || (options.host + ":" + options.port))];

	if(options.hot)
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
	var uri = protocol + "://" + options.host + ":" + options.port + "/";
	if(!options.inline)
		uri += "webpack-dev-server/";

	if(err) throw err;
	console.log(" " + uri);
	console.log("webpack result is served from " + options.publicPath);
	if(typeof options.contentBase === "object")
		console.log("requests are proxied to " + options.contentBase.target);
	else
		console.log("content is served from " + options.contentBase);
	if(options.historyApiFallback)
		console.log("404s will fallback to %s", options.historyApiFallback.index || "/index.html");
	if(options.open)
		open(uri);
});
