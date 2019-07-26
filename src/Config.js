SlackBot.Config = function Config(config) {
  this.initialize(config);
};

SlackBot.Config.prototype = {
  initialize: function initialize(config) {
    this.setAll(config);
  },

  get: function get(name) {
    return SlackBot.Obj.merge(this.config.common, this.config[name]);
  },

  getAll: function getAll() {
    return this.config;
  },

  getCommon: function getCommon(name) {
    return this.config.common[name];
  },

  getCommonAll: function getCommonAll() {
    return this.config.common;
  },

  set: function set(name, value) {
    this.config[name] = value;
  },

  setAll: function setAll(config) {
    this.config = config ? config : {};

    if (!this.config.common) {
      this.config.common = {};
    }
  },

  setCommon: function setCommon(name, value) {
    this.config.common[name] = value;
  },

  setCommonAll: function setCommonAll(values) {
    this.config.common = values;
  }
};
