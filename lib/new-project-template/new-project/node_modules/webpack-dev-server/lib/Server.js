var fs = require("fs");
var path = require("path");
var webpackDevMiddleware = require("webpack-dev-middleware");
var express = require("express");
var compress = require("compression");
var sockjs = require("sockjs");
var StreamCache = require("stream-cache");
var http = require("http");
var https = require("https");
var httpProxyMiddleware = require("http-proxy-middleware");
var serveIndex = require("serve-index");
var historyApiFallback = require("connect-history-api-fallback");

function Server(compiler, options) {
	// Default options
	if(!options) options = {};

	if(options.lazy && !options.filename) {
		throw new Error("'filename' option must be set in lazy mode.");
	}

	this.hot = options.hot || options.hotOnly;
	this.headers = options.headers;
	this.sockets = [];

	// Listening for events
	var invalidPlugin = function() {
		this.sockWrite(this.sockets, "invalid");
	}.bind(this);
	compiler.plugin("compile", invalidPlugin);
	compiler.plugin("invalid", invalidPlugin);
	compiler.plugin("done", function(stats) {
		this._sendStats(this.sockets, stats.toJson());
		this._stats = stats;
	}.bind(this));

	// Prepare live html page
	var livePage = this.livePage = new StreamCache();
	fs.createReadStream(path.join(__dirname, "..", "client", "live.html")).pipe(livePage);

	// Prepare the live js file
	var liveJs = new StreamCache();
	fs.createReadStream(path.join(__dirname, "..", "client", "live.bundle.js")).pipe(liveJs);

	// Prepare the inlined js file
	var inlinedJs = new StreamCache();
	fs.createReadStream(path.join(__dirname, "..", "client", "index.bundle.js")).pipe(inlinedJs);

	// Init express server
	var app = this.app = new express();

	// middleware for serving webpack bundle
	this.middleware = webpackDevMiddleware(compiler, options);

	app.get("/__webpack_dev_server__/live.bundle.js", function(req, res) {
		res.setHeader("Content-Type", "application/javascript");
		liveJs.pipe(res);
	});

	app.get("/webpack-dev-server.js", function(req, res) {
		res.setHeader("Content-Type", "application/javascript");
		inlinedJs.pipe(res);
	});

	app.get("/webpack-dev-server/*", function(req, res) {
		res.setHeader("Content-Type", "text/html");
		this.livePage.pipe(res);
	}.bind(this));

	app.get("/webpack-dev-server", function(req, res) {
		res.setHeader("Content-Type", "text/html");
		res.write('<!DOCTYPE html><html><head><meta charset="utf-8"/></head><body>');
		var path = this.middleware.getFilenameFromUrl(options.publicPath || "/");
		var fs = this.middleware.fileSystem;

		function writeDirectory(baseUrl, basePath) {
			var content = fs.readdirSync(basePath);
			res.write("<ul>");
			content.forEach(function(item) {
				var p = basePath + "/" + item;
				if(fs.statSync(p).isFile()) {
					res.write('<li><a href="');
					res.write(baseUrl + item);
					res.write('">');
					res.write(item);
					res.write('</a></li>');
					if(/\.js$/.test(item)) {
						var htmlItem = item.substr(0, item.length - 3);
						res.write('<li><a href="');
						res.write(baseUrl + htmlItem);
						res.write('">');
						res.write(htmlItem);
						res.write('</a> (magic html for ');
						res.write(item);
						res.write(') (<a href="');
						res.write(baseUrl.replace(/(^(https?:\/\/[^\/]+)?\/)/, "$1webpack-dev-server/") + htmlItem);
						res.write('">webpack-dev-server</a>)</li>');
					}
				} else {
					res.write('<li>');
					res.write(item);
					res.write('<br>');
					writeDirectory(baseUrl + item + "/", p);
					res.write('</li>');
				}
			});
			res.write("</ul>");
		}
		writeDirectory(options.publicPath || "/", path);
		res.end('</body></html>');
	}.bind(this));

	var features = {
		compress: function() {
			if(options.compress) {
				// Enable gzip compression.
				app.use(compress());
			}
		},

		proxy: function() {
			if(options.proxy) {
				/**
				 * Assume a proxy configuration specified as:
				 * proxy: 'a url'
				 */
				if(typeof options.proxy === 'string') {
					options.proxy = [{
						context: options.proxy
					}];
				}

				/**
				 * Assume a proxy configuration specified as:
				 * proxy: {
				 *   'context': { options }
				 * }
				 * OR
				 * proxy: {
				 *   'context': 'target'
				 * }
				 */
				if(!Array.isArray(options.proxy)) {
					options.proxy = Object.keys(options.proxy).map(function(context) {
						var proxyOptions;
						var correctedContext = context.replace(/\/\*$/, "");

						if(typeof options.proxy[context] === 'string') {
							proxyOptions = {
								context: correctedContext,
								target: options.proxy[context]
							};
						} else {
							proxyOptions = options.proxy[context];
							proxyOptions.context = correctedContext;
						}

						return proxyOptions;
					});
				}

				/**
				 * Assume a proxy configuration specified as:
				 * proxy: [
				 *   {
				 *     context: ...,
				 *     ...options...
				 *   }
				 * ]
				 */
				options.proxy.forEach(function(proxyConfig) {
					var context = proxyConfig.context || proxyConfig.path;

					app.use(function(req, res, next) {
						if(typeof proxyConfig.bypass === 'function') {
							var bypassUrl = proxyConfig.bypass(req, res, proxyConfig) || false;

							if(bypassUrl) {
								req.url = bypassUrl;
							}
						}

						next();
					}, httpProxyMiddleware(context, proxyConfig));
				});
			}
		},

		historyApiFallback: function() {
			if(options.historyApiFallback) {
				// Fall back to /index.html if nothing else matches.
				app.use(historyApiFallback(typeof options.historyApiFallback === 'object' ? options.historyApiFallback : null));
			}
		},

		contentBase: function() {
			if(options.contentBase !== false) {
				var contentBase = options.contentBase || process.cwd();

				if(Array.isArray(contentBase)) {
					contentBase.forEach(function(item) {
						app.get("*", express.static(item));
					});
					contentBase.forEach(function(item) {
						app.get("*", serveIndex(item));
					});
				} else if(typeof contentBase === "object") {
					console.log('Using contentBase as a proxy is deprecated and will be removed in the next major version. Please use the proxy option instead.\n\nTo update remove the contentBase option from webpack.config.js and add this:');
					console.log('proxy: {\n\t"*": <your current contentBase configuration>\n}');
					// Proxy every request to contentBase.target
					app.all("*", function(req, res) {
						proxy.web(req, res, contentBase, function(err) {
							var msg = "cannot proxy to " + contentBase.target + " (" + err.message + ")";
							this.sockWrite(this.sockets, "proxy-error", [msg]);
							res.statusCode = 502;
							res.end();
						}.bind(this));
					}.bind(this));
				} else if(/^(https?:)?\/\//.test(contentBase)) {
					// Redirect every request to contentBase
					app.get("*", function(req, res) {
						res.writeHead(302, {
							'Location': contentBase + req.path + (req._parsedUrl.search || "")
						});
						res.end();
					});
				} else if(typeof contentBase === "number") {
					// Redirect every request to the port contentBase
					app.get("*", function(req, res) {
						res.writeHead(302, {
							'Location': "//localhost:" + contentBase + req.path + (req._parsedUrl.search || "")
						});
						res.end();
					});
				} else {
					// route content request
					app.get("*", express.static(contentBase, options.staticOptions), serveIndex(contentBase));
				}
			}
		}.bind(this),

		middleware: function() {
			// include our middleware to ensure it is able to handle '/index.html' request after redirect
			app.use(this.middleware);
		}.bind(this),

		headers: function() {
			app.get("*", this.setContentHeaders.bind(this));
		}.bind(this),

		magicHtml: function() {
			app.get("*", this.serveMagicHtml.bind(this));
		}.bind(this),

		setup: function() {
			if(typeof options.setup === "function")
				options.setup(app);
		}
	};

	var defaultFeatures = ["setup", "headers", "middleware"];
	if(options.proxy)
		defaultFeatures.push("proxy");
	if(options.historyApiFallback)
		defaultFeatures.push("historyApiFallback", "middleware");
	defaultFeatures.push("magicHtml");
	if(options.contentBase !== false)
		defaultFeatures.push("contentBase");
	// compress is placed last and uses unshift so that it will be the first middleware used
	if(options.compress)
		defaultFeatures.unshift("compress");

	(options.features || defaultFeatures).forEach(function(feature) {
		features[feature]();
	}, this);

	if(options.https) {
		// for keep supporting CLI parameters
		if(typeof options.https === 'boolean') {
			options.https = {
				key: options.key,
				cert: options.cert,
				ca: options.ca
			};
		}

		// using built-in self-signed certificate if no certificate was configured
		options.https.key = options.https.key || fs.readFileSync(path.join(__dirname, "../ssl/server.key"));
		options.https.cert = options.https.cert || fs.readFileSync(path.join(__dirname, "../ssl/server.crt"));
		options.https.ca = options.https.ca || fs.readFileSync(path.join(__dirname, "../ssl/ca.crt"));

		this.listeningApp = https.createServer(options.https, app);
	} else {
		this.listeningApp = http.createServer(app);
	}
}

Server.prototype.use = function() {
	this.app.use.apply(this.app, arguments);
}

Server.prototype.setContentHeaders = function(req, res, next) {
	if(this.headers) {
		for(var name in this.headers) {
			res.setHeader(name, this.headers[name]);
		}
	}

	next();
}

// delegate listen call and init sockjs
Server.prototype.listen = function() {
	this.listeningApp.listen.apply(this.listeningApp, arguments);
	var sockServer = sockjs.createServer({
		// Limit useless logs
		log: function(severity, line) {
			if(severity === "error") {
				console.log(line);
			}
		}
	});
	sockServer.on("connection", function(conn) {
		this.sockets.push(conn);

		// Remove the connection when it's closed
		conn.on("close", function() {
			var connIndex = this.sockets.indexOf(conn);
			if(connIndex >= 0) {
				this.sockets.splice(connIndex, 1);
			}
		}.bind(this));

		if(this.hot) this.sockWrite([conn], "hot");
		if(!this._stats) return;
		this._sendStats([conn], this._stats.toJson(), true);
	}.bind(this));

	sockServer.installHandlers(this.listeningApp, {
		prefix: '/sockjs-node'
	});
}

Server.prototype.close = function() {
	this.sockets.forEach(function(sock) {
		sock.close();
	});
	this.sockets = [];
	this.middleware.close();
	this.listeningApp.close();
}

Server.prototype.sockWrite = function(sockets, type, data) {
	sockets.forEach(function(sock) {
		sock.write(JSON.stringify({
			type: type,
			data: data
		}));
	});
}

Server.prototype.serveMagicHtml = function(req, res, next) {
	var _path = req.path;
	try {
		if(!this.middleware.fileSystem.statSync(this.middleware.getFilenameFromUrl(_path + ".js")).isFile())
			return next();
		// Serve a page that executes the javascript
		res.write('<!DOCTYPE html><html><head><meta charset="utf-8"/></head><body><script type="text/javascript" charset="utf-8" src="');
		res.write(_path);
		res.write('.js');
		res.write(req._parsedUrl.search || "");
		res.end('"></script></body></html>');
	} catch(e) {
		return next();
	}
}

// send stats to a socket or multiple sockets
Server.prototype._sendStats = function(sockets, stats, force) {
	if(!force &&
		stats &&
		(!stats.errors || stats.errors.length === 0) &&
		stats.assets &&
		stats.assets.every(function(asset) {
			return !asset.emitted;
		})
	)
		return this.sockWrite(sockets, "still-ok");
	this.sockWrite(sockets, "hash", stats.hash);
	if(stats.errors.length > 0)
		this.sockWrite(sockets, "errors", stats.errors);
	else if(stats.warnings.length > 0)
		this.sockWrite(sockets, "warnings", stats.warnings);
	else
		this.sockWrite(sockets, "ok");
}

Server.prototype.invalidate = function() {
	if(this.middleware) this.middleware.invalidate();
}

module.exports = Server;
