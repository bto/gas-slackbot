SlackBot.DI = function DI(services) {
  this.initialize(services);
};

SlackBot.DI.prototype = {
  initialize: function initialize(services) {
    this.setAll(services);
    return this;
  },

  get: function get(name) {
    var service = this.services[name];
    if (!service) {
      return null;
    }

    if (service.toString() === '[object Object]') {
      return service;
    }

    if (typeof service === 'function') {
      return this.services[name](this);
    }

    throw new Error('not supported service value');
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
    return this;
  },

  setAll: function setAll(services) {
    this.objects = {};
    this.services = services ? services : {};
    return this;
  },

  setShared: function setShared(name, object) {
    this.objects[name] = object;
    return this;
  }
};
