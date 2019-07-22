SlackBot.Log = function Log() {
  this.initialize();
};

SlackBot.Log.DEBUG = 0;
SlackBot.Log.INFO  = 1;
SlackBot.Log.WARN  = 2;
SlackBot.Log.ERROR = 3;
SlackBot.Log.FATAL = 4;

SlackBot.Log.prototype = {
  messages: [],

  initialize: function initialize() {
  },

  debug: function debug(message) {
    this.write(SlackBot.Log.DEBUG, message);
  },

  info: function info(message) {
    this.write(SlackBot.Log.INFO, message);
  },

  warn: function warn(message) {
    this.write(SlackBot.Log.WARN, message);
  },

  error: function error(message) {
    this.write(SlackBot.Log.ERROR, message);
  },

  fatal: function fatal(message) {
    this.write(SlackBot.Log.FATAL, message);
  },

  debugString: function debugString() {
    this.toString(SlackBot.Log.DEBUG);
  },

  infoString: function infoString() {
    this.toString(SlackBot.Log.INFO);
  },

  warnString: function warnString() {
    this.toString(SlackBot.Log.WARN);
  },

  errorString: function errorString() {
    this.toString(SlackBot.Log.ERROR);
  },

  fatalString: function fatalString() {
    this.toString(SlackBot.Log.FATAL);
  },

  toString: function toString(level) {
    return this.messages.reduce(function reducer(message, v) {
      if (v.level < level) {
        return message;
      }
      return message + v.message;
    }, '');
  },

  write: function write(level, message) {
    this.messages.push({
      level: level,
      message: message
    });
  }
};
