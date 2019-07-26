SlackBot.DI = function DI(services) {
  this.initialize(services);
};

SlackBot.DI.prototype = {
  initialize: function initialize(services) {
    this.setAll(services);
  },

  get: function get(name) {
    if (!this.services[name]) {
      return null;
    }

    var config = name === 'config' ? null : this.getShared('config').get(name);
    return this.services[name](config);
  },

  getShared: function getShared(name) {
    if (this.objects[name]) {
      return this.objects[name];
    }

    var obj = this.get(name);
    if (!obj) {
      return null;
    }

    this.objects[name] = obj;
    return this.objects[name];
  },

  set: function set(name, func) {
    this.objects[name] = null;
    this.services[name] = func;
  },

  setAll: function setAll(services) {
    this.objects = {};
    this.services = services ? services : {};

    if (!this.services.config) {
      this.services.config = function config() {
        return new SlackBot.Config();
      };
    }
  }
};
