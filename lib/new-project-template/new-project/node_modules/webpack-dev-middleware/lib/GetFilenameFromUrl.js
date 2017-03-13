var pathJoin = require("./PathJoin");
var urlParse = require("url").parse;

function getFilenameFromUrl(publicPath, outputPath, url) {
	var filename;
	url = decodeURIComponent(url);

	// localPrefix is the folder our bundle should be in
	var localPrefix = urlParse(publicPath || "/", false, true);
	var urlObject = urlParse(url);

	// publicPath has the hostname that is not the same as request url's, should fail
	if(localPrefix.hostname !== null && urlObject.hostname !== null &&
		localPrefix.hostname !== urlObject.hostname) {
		return false;
	}

	// publicPath is not in url, so it should fail
	if(publicPath && localPrefix.hostname === urlObject.hostname && url.indexOf(publicPath) !== 0) {
		return false;
	}

	// strip localPrefix from the start of url
	if(urlObject.pathname.indexOf(localPrefix.pathname) === 0) {
		filename = urlObject.pathname.substr(localPrefix.pathname.length);
	}

	if(!urlObject.hostname && localPrefix.hostname &&
		url.indexOf(localPrefix.path) !== 0) {
		return false;
	}
	// and if not match, use outputPath as filename
	return filename ? pathJoin(outputPath, filename) : outputPath;

}

module.exports = getFilenameFromUrl;
