var cp = require('child_process'),
    os = require('os'),
    fs = require('fs'),
    url = require('url'),
    path = require('path'),
    shellwords = require('shellwords'),
    semver = require('semver'),
    clone = require('lodash.clonedeep');


var escapeQuotes = function (str) {
  if (typeof str === 'string') {
    return str.replace(/(["$`\\])/g, '\\$1');
  } else {
    return str;
  }
};

var inArray = function (arr, val) {
  for(var i = 0; i < arr.length; i++) {
    if (arr[i] === val) {
      return true;
    }
  }
  return false;
};

var notifySendFlags = {
  "u":            "urgency",
  "urgency":      "urgency",
  "t":            "expire-time",
  "e":            "expire-time",
  "expire":       "expire-time",
  "expire-time":  "expire-time",
  "i":            "icon",
  "icon":         "icon",
  "c":            "category",
  "category":     "category",
  "subtitle":     "category",
  "h":            "hint",
  "hint":         "hint"
};

module.exports.command = function (notifier, options, cb) {
  notifier = shellwords.escape(notifier);
  return cp.exec(notifier + ' ' + options.join(' '), function (error, stdout, stderr) {
    if (error) return cb(error);
    cb(stderr, stdout);
  });
};

module.exports.fileCommand = function (notifier, options, cb) {
  return cp.execFile(notifier, options, function (error, stdout, stderr) {
    if (error) return cb(error, stdout);
    cb(stderr, stdout);
  });
};

module.exports.immediateFileCommand = function (notifier, options, cb) {
  notifierExists(notifier, function (exists) {
    if (!exists) return cb(new Error('Notifier (' + notifier + ') not found on system.'));
    cp.execFile(notifier, options);
    cb();
  });
};

function notifierExists (notifier, cb) {
  return fs.stat(notifier, function (err, stat) {
    if (!err) return cb(stat.isFile());

    // Check if Windows alias
    if (!!path.extname(notifier)) {
      // Has extentioon, no need to check more
      return cb(false);
    }

    // Check if there is an exe file in the directory
    return fs.stat(notifier + '.exe', function (err, stat) {
      cb(stat.isFile());
    });
  });
}

var mapAppIcon = function (options) {
  if (options.appIcon) {
    options.icon = options.appIcon;
    delete options.appIcon;
  }

  return options;
};

var mapText = function (options) {
  if (options.text) {
    options.message = options.text;
    delete options.text;
  }

  return options;
};

var mapIconShorthand = function (options) {
  if (options.i) {
    options.icon = options.i;
    delete options.i;
  }

  return options;
};

module.exports.mapToNotifySend = function (options) {
  options = mapAppIcon(options);
  options = mapText(options);

  for (var key in options) {
    if (key === "message" || key === "title") continue;
    if (options.hasOwnProperty(key) && (notifySendFlags[key] != key)) {
      options[notifySendFlags[key]] = options[key];
      delete options[key];
    }
  }

  return options;
};

module.exports.mapToGrowl = function (options) {
  options = mapAppIcon(options);
  options = mapIconShorthand(options);
  options = mapText(options);

  if (options.icon && !Buffer.isBuffer(options.icon)) {
    try {
      options.icon = fs.readFileSync(options.icon);
    }catch(ex){

    }
  }

  return options;
};

module.exports.mapToMac = function (options) {
  options = mapIconShorthand(options);
  options = mapText(options);

  if (options.icon) {
    options.appIcon = options.icon;
    delete options.icon;
  }

  if (options.sound === true) {
    options.sound = 'Bottle';
  }

  if (options.sound === false) {
    delete options.sound;
  }

  return options;
};

module.exports.actionJackerDecorator = function (emitter, options, fn, mapper) {
  options = clone(options);
  fn = fn || function (err, data) {};
  return function (err, data) {

    var resultantData = data;
    // Sanitize the data
    if(resultantData) {
      resultantData = resultantData.toLowerCase().trim();
      if(resultantData.match(/^activate/)) {
        resultantData = 'activate';
      }
    }
    fn.apply(emitter, [err, resultantData]);
    if (err || !mapper || !resultantData) return;

    var key = mapper(resultantData);
    if (!key) return;
    emitter.emit(key, emitter, options);
  };
};

module.exports.constructArgumentList = function (options, extra) {
  var args = [];
  extra = extra || {};

  // Massive ugly setup. Default args
  var initial = extra.initial || [];
  var keyExtra = extra.keyExtra || "";
  var allowedArguments = extra.allowedArguments || [];
  var noEscape = extra.noEscape !== void 0;
  var checkForAllowed = extra.allowedArguments !== void 0;
  var explicitTrue = !!extra.explicitTrue;
  var wrapper = extra.wrapper === void 0 ? '"' : extra.wrapper;

  var escapeFn = function(arg) {
    if (!noEscape) {
      arg = escapeQuotes(arg);
    }
    if(typeof arg === 'string'){
      arg = arg.replace(/\r?\n/g, '\\n');
    }
    return arg;
  }

  initial.forEach(function (val) {
    args.push(wrapper + escapeFn(val) + wrapper);
  });
  for(var key in options) {
    if (options.hasOwnProperty(key) && (!checkForAllowed || inArray(allowedArguments, key))) {
      if (explicitTrue && options[key] === true) args.push('-' + keyExtra + key);
      else if (explicitTrue && options[key] === false) continue;
      else args.push('-' + keyExtra + key, wrapper + escapeFn(options[key]) + wrapper);
    }
  }
  return args;
};

module.exports.mapToWin8 = function (options){

  options = mapAppIcon(options);
  options = mapText(options);

  if(options.icon){
    if (/^file:\/+/.test(options.icon)) {
      // should parse file protocol URL to path
      options.p = url.parse(options.icon).pathname.replace(/^\/(\w\:\/)/, "$1").replace(/\//g, "\\");
    } else {
      options.p = options.icon;
    }
    delete options.icon;
  }

  if(options.message){
    // Remove escape char to debug "HRESULT : 0xC00CE508" exception
    options.m = options.message.replace(/\x1b/g, '');
    delete options.message;
  }

  if (options.title) {
    options.t = options.title;
    delete options.title;
  }

  if (options.quiet || options.silent) {
    options.q = options.quiet || options.silent;
    delete options.quiet;
    delete options.silent;
  }

  if (options.q !== false) {
    options.q = true;
  } else {
    delete options.q;
  }

  if (options.sound) {
    delete options.q;
    delete options.sound;
  }

  if (options.wait) {
    options.w = options.wait;
    delete options.wait;
  }

  return options;
};

module.exports.mapToNotifu = function (options) {
  options = mapAppIcon(options);
  options = mapText(options);

  if(options.icon){
    options.i = options.icon;
    delete options.icon;
  }

  if(options.message){
    options.m = options.message;
    delete options.message;
  }

  if (options.title) {
    options.p = options.title;
    delete options.title;
  }

  if (options.time) {
    options.d = options.time;
    delete options.time;
  }

  if (options.q !== false) {
    options.q = true;
  } else {
    delete options.q;
  }

  if (options.quiet === false) {
    delete options.q;
    delete options.quiet;
  }

  if (options.sound) {
    delete options.q;
    delete options.sound;
  }

  if (options.t) {
    options.d = options.t;
    delete options.t;
  }

  if (options.type) {
    options.t = sanitizeNotifuTypeArgument(options.type);
    delete options.type;
  }

  return options;
};

module.exports.isMac = function() {
  return os.type() === 'Darwin';
};

module.exports.isMountainLion = function() {
  return os.type() === 'Darwin' && semver.satisfies(garanteeSemverFormat(os.release()), '>=12.0.0');
};

module.exports.isWin8 = function() {
  return os.type() === 'Windows_NT' && semver.satisfies(garanteeSemverFormat(os.release()), '>=6.2.9200');
};

module.exports.isLessThanWin8 = function() {
  return os.type() === 'Windows_NT' && semver.satisfies(garanteeSemverFormat(os.release()), '<6.2.9200');
};

function garanteeSemverFormat (version) {
  if (version.split('.').length === 2) {
    version += '.0';
  }
  return version;
}

function sanitizeNotifuTypeArgument(type) {
  if (typeof type === 'string' || type instanceof String) {
    if (type.toLowerCase() == 'info')
      return 'info';
    if (type.toLowerCase() == 'warn')
      return 'warn';
    if (type.toLowerCase() == 'error')
      return 'error';
  }

  return 'info';
}