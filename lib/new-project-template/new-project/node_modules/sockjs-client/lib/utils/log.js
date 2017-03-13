'use strict';

var logObject = {};
['log', 'debug', 'warn'].forEach(function (level) {
  var levelExists = global.console && global.console[level] && global.console[level].apply;
  logObject[level] = levelExists ? function () {
    return global.console[level].apply(global.console, arguments);
  } : (level === 'log' ? function () {} : logObject.log);
});

module.exports = logObject;
