/**
 * Wrapper for the toaster (https://github.com/nels-o/toaster)
 */
var path = require('path'),
    notifier = path.resolve(__dirname, '../vendor/toaster/toast.exe'),
    utils = require('../lib/utils'),
    Balloon = require('./balloon'),
    cloneDeep = require('lodash.clonedeep');

var EventEmitter = require('events').EventEmitter;
var util = require('util');

var fallback = void 0;

module.exports = WindowsToaster;

function WindowsToaster (options) {
  options = cloneDeep(options || {});
  if (!(this instanceof WindowsToaster)) {
    return new WindowsToaster(options);
  }

  this.options = options;

  EventEmitter.call(this);
}
util.inherits(WindowsToaster, EventEmitter);

WindowsToaster.prototype.notify = function (options, callback) {
  options = cloneDeep(options || {});
  callback = callback || function () {};

  if (typeof options === 'string') options = {
      title: 'node-notifier',
      message: options
  };

  var actionJackedCallback = utils.actionJackerDecorator(this, options, callback, function (data) {
    if (data === 'activate') {
      return 'click';
    }
    if (data === 'timeout') {
      return 'timeout';
    }
    return false;
  });

  options.title = options.title || 'Node Notification:';

  if (!options.message) {
    callback(new Error('Message is required.'));
    return this;
  }

  if (!utils.isWin8() && !!this.options.withFallback) {
    fallback = fallback || new Balloon(this.options);
    return fallback.notify(options, callback);
  }

  options = utils.mapToWin8(options);
  var argsList = utils.constructArgumentList(options, {
    wrapper: '',
    noEscape: true
  });
  utils.fileCommand(this.options.customPath || notifier, argsList, actionJackedCallback);
  return this;
};
