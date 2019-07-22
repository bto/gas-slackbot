SlackBot.Log = function Log(level) {
  this.initialize(level);
};

SlackBot.Log.DEBUG = 0;
SlackBot.Log.INFO  = 1;
SlackBot.Log.WARN  = 2;
SlackBot.Log.ERROR = 3;
SlackBot.Log.FATAL = 4;

SlackBot.Log.prototype = {
  messages: [],

  initialize: function initialize(level) {
    this.level = typeof level === 'undefined' ? SlackBot.Log.WARN : level;
    this.messages = [];
  },

  debug: function debug() {
    return this.write(SlackBot.Log.DEBUG, arguments);
  },

  info: function info() {
    return this.write(SlackBot.Log.INFO, arguments);
  },

  warn: function warn() {
    return this.write(SlackBot.Log.WARN, arguments);
  },

  error: function error() {
    return this.write(SlackBot.Log.ERROR, arguments);
  },

  fatal: function fatal() {
    return this.write(SlackBot.Log.FATAL, arguments);
  },

  toString: function toString() {
    var levels = [];
    levels[SlackBot.Log.DEBUG] = 'DEBUG';
    levels[SlackBot.Log.INFO]  = 'INFO';
    levels[SlackBot.Log.WARN]  = 'WARN';
    levels[SlackBot.Log.ERROR] = 'ERROR';
    levels[SlackBot.Log.FATAL] = 'FATAL';

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
