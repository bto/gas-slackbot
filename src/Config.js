SlackBot.Config = function Config(config) {
  this.initialize(config);
};

SlackBot.Config.prototype = {
  initialize: function initialize(config) {
    this.common = {};
    this.setAll(config);
  },

  get: function get(name) {
    return SlackBot.Obj.merge(this.common, this.config[name]);
  },

  getAll: function getAll() {
    return this.config;
  },

  getCommon: function getCommon(name) {
    return this.common[name];
  },

  set: function set(name, value) {
    this.config[name] = value;
  },

  setAll: function setAll(config) {
    this.config = config ? config : {};
  },

  setCommon: function setCommon(name, value) {
    this.common[name] = value;
  }
};
