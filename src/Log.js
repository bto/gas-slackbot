function Log(level) {
  this.initialize(level);
}

Log.DEBUG = 0;
Log.INFO  = 1;
Log.WARN  = 2;
Log.ERROR = 3;
Log.FATAL = 4;

Log.prototype = {
  messages: [],

  initialize: function initialize(level) {
    this.level = typeof level === 'undefined' ? Log.WARN : level;
    this.messages = [];
  },

  debug: function debug() {
    return this.write(Log.DEBUG, arguments);
  },

  info: function info() {
    return this.write(Log.INFO, arguments);
  },

  warn: function warn() {
    return this.write(Log.WARN, arguments);
  },

  error: function error() {
    return this.write(Log.ERROR, arguments);
  },

  fatal: function fatal() {
    return this.write(Log.FATAL, arguments);
  },

  toString: function toString() {
    var levels = [];
    levels[Log.DEBUG] = 'DEBUG';
    levels[Log.INFO]  = 'INFO';
    levels[Log.WARN]  = 'WARN';
    levels[Log.ERROR] = 'ERROR';
    levels[Log.FATAL] = 'FATAL';

    return this.messages.reduce(function reducer(message, v) {
      return message + v.time + ': ' + levels[v.level] + ': ' + v.message + '\n';
    }, '');
  },

  write: function write(level, args) {
    if (level < this.level) {
      return this;
    }

    this.messages.push({
      level: level,
      message: Utilities.formatString.apply(null, args),
      time: new Date()
    });

    return this;
  }
};
