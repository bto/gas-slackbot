SlackBot.Config = function Config(config) {
  this.initialize(config);
};

SlackBot.Config.prototype = {
  initialize: function initialize(config) {
    this.setAll(config);
  },

  get: function get(name) {
    return this.config[name];
  },

  getAll: function getAll() {
    return this.config;
  },

  set: function set(name, params) {
    this.config[name] = params;
  },

  setAll: function setAll(config) {
    this.config = config ? config : {};
  }
};
