var url = require('url');
var stripAnsi = require('strip-ansi');
var socket = require('./socket');

function getCurrentScriptSource() {
	// `document.currentScript` is the most accurate way to find the current script,
	// but is not supported in all browsers.
	if(document.currentScript)
		return document.currentScript.getAttribute("src");
	// Fall back to getting all scripts in the document.
	var scriptElements = document.scripts || [];
	var currentScript = scriptElements[scriptElements.length - 1];
	if(currentScript)
		return currentScript.getAttribute("src");
	// Fail as there was no script to use.
	throw new Error("[WDS] Failed to get current script source");
}

var urlParts;
if(typeof __resourceQuery === "string" && __resourceQuery) {
	// If this bundle is inlined, use the resource query to get the correct url.
	urlParts = url.parse(__resourceQuery.substr(1));
} else {
	// Else, get the url from the <script> this file was called with.
	var scriptHost = getCurrentScriptSource();
	scriptHost = scriptHost.replace(/\/[^\/]+$/, "");
	urlParts = url.parse((scriptHost ? scriptHost : "/"), false, true);
}

var hot = false;
var initial = true;
var currentHash = "";
var logLevel = "info";

function log(level, msg) {
	if(logLevel === "info" && level === "info")
		return console.log(msg);
	if(["info", "warning"].indexOf(logLevel) >= 0 && level === "warning")
		return console.warn(msg);
	if(["info", "warning", "error"].indexOf(logLevel) >= 0 && level === "error")
		return console.error(msg);
}

var onSocketMsg = {
	hot: function() {
		hot = true;
		log("info", "[WDS] Hot Module Replacement enabled.");
	},
	invalid: function() {
		log("info", "[WDS] App updated. Recompiling...");
	},
	hash: function(hash) {
		currentHash = hash;
	},
	"still-ok": function() {
		log("info", "[WDS] Nothing changed.")
	},
	"log-level": function(level) {
		logLevel = level;
	},
	ok: function() {
		if(initial) return initial = false;
		reloadApp();
	},
	warnings: function(warnings) {
		log("info", "[WDS] Warnings while compiling.");
		for(var i = 0; i < warnings.length; i++)
			console.warn(stripAnsi(warnings[i]));
		if(initial) return initial = false;
		reloadApp();
	},
	errors: function(errors) {
		log("info", "[WDS] Errors while compiling.");
		for(var i = 0; i < errors.length; i++)
			console.error(stripAnsi(errors[i]));
		if(initial) return initial = false;
		reloadApp();
	},
	"proxy-error": function(errors) {
		log("info", "[WDS] Proxy error.");
		for(var i = 0; i < errors.length; i++)
			log("error", stripAnsi(errors[i]));
		if(initial) return initial = false;
	},
	close: function() {
		log("error", "[WDS] Disconnected!");
	}
};

var hostname = urlParts.hostname;
var protocol = urlParts.protocol;

if(urlParts.hostname === '0.0.0.0') {
	// why do we need this check?
	// hostname n/a for file protocol (example, when using electron, ionic)
	// see: https://github.com/webpack/webpack-dev-server/pull/384
	if(window.location.hostname && !!~window.location.protocol.indexOf('http')) {
		hostname = window.location.hostname;
	}
}

// `hostname` can be empty when the script path is relative. In that case, specifying
// a protocol would result in an invalid URL.
// When https is used in the app, secure websockets are always necessary
// because the browser doesn't accept non-secure websockets.
if(hostname && (window.location.protocol === "https:" || urlParts.hostname === '0.0.0.0')) {
	protocol = window.location.protocol;
}

var socketUrl = url.format({
	protocol: protocol,
	auth: urlParts.auth,
	hostname: hostname,
	port: (urlParts.port === '0') ? window.location.port : urlParts.port,
	pathname: urlParts.path == null || urlParts.path === '/' ? "/sockjs-node" : urlParts.path
});

socket(socketUrl, onSocketMsg);

function reloadApp() {
	if(hot) {
		log("info", "[WDS] App hot update...");
		window.postMessage("webpackHotUpdate" + currentHash, "*");
	} else {
		log("info", "[WDS] App updated. Reloading...");
		window.location.reload();
	}
}
