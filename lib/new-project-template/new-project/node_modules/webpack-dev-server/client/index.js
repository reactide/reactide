var url = require('url');
var SockJS = require("sockjs-client");
var stripAnsi = require('strip-ansi');
var urlParts;
if (typeof __resourceQuery === "string" && __resourceQuery) {
	// If this bundle is inlined, use the resource query to get the correct url.
	urlParts = url.parse(__resourceQuery.substr(1));
} else {
	// Else, get the url from the <script> this file was called with.
	var scriptElements = document.getElementsByTagName("script");
	var scriptHost = scriptElements[scriptElements.length-1].getAttribute("src");
	scriptHost = scriptHost && scriptHost.replace(/\/[^\/]+$/, "");
	urlParts = url.parse((scriptHost ? scriptHost : "/"), false, true);
}

var sock = null;
var hot = false;
var initial = true;
var currentHash = "";

var onSocketMsg = {
	hot: function() {
		hot = true;
		console.log("[WDS] Hot Module Replacement enabled.");
	},
	invalid: function() {
		console.log("[WDS] App updated. Recompiling...");
	},
	hash: function(hash) {
		currentHash = hash;
	},
	"still-ok": function() {
		console.log("[WDS] Nothing changed.")
	},
	ok: function() {
		if(initial) return initial = false;
		reloadApp();
	},
	warnings: function(warnings) {
		console.log("[WDS] Warnings while compiling.");
		for(var i = 0; i < warnings.length; i++)
			console.warn(stripAnsi(warnings[i]));
		if(initial) return initial = false;
		reloadApp();
	},
	errors: function(errors) {
		console.log("[WDS] Errors while compiling.");
		for(var i = 0; i < errors.length; i++)
			console.error(stripAnsi(errors[i]));
		if(initial) return initial = false;
		reloadApp();
	},
	"proxy-error": function(errors) {
		console.log("[WDS] Proxy error.");
		for(var i = 0; i < errors.length; i++)
			console.error(stripAnsi(errors[i]));
		if(initial) return initial = false;
	}
};

var newConnection = function() {
	sock = new SockJS(url.format({
		protocol: (window.location.protocol === "https:" || urlParts.hostname === '0.0.0.0') ? window.location.protocol : urlParts.protocol,
		auth: urlParts.auth,
		hostname: (urlParts.hostname === '0.0.0.0') ? window.location.hostname : urlParts.hostname,
		port: (urlParts.port === '0') ? window.location.port : urlParts.port,
		pathname: urlParts.path == null || urlParts.path === '/' ? "/sockjs-node" : urlParts.path
	}));

	sock.onclose = function() {
		console.error("[WDS] Disconnected!");

		// Try to reconnect.
		sock = null;
		setTimeout(function () {
			newConnection();
		}, 2000);
	};

	sock.onmessage = function(e) {
		// This assumes that all data sent via the websocket is JSON.
		var msg = JSON.parse(e.data);
		onSocketMsg[msg.type](msg.data);
	};
};

newConnection();

function reloadApp() {
	if(hot) {
		console.log("[WDS] App hot update...");
		var hotEmitter = require("webpack/hot/emitter");
		hotEmitter.emit("webpackHotUpdate", currentHash);
		if(typeof window !== "undefined") {
			// broadcast update to window
			window.postMessage("webpackHotUpdate" + currentHash, "*");
		}
	} else {
		console.log("[WDS] App updated. Reloading...");
		window.location.reload();
	}
}
