SlackBot.Obj = {
  isArray: function isArray(x) {
    return Object.prototype.toString.call(x) === '[object Array]';
  },

  isGASObject: function isGASObject(x, className) {
    if (Object.prototype.toString.call(x) !== '[object JavaObject]') {
      return false;
    }

    if (className) {
      return x.toString() === className;
    }

    return true;
  },

  isInteger: function isInteger(x) {
    return typeof x === 'number' && x % 1 === 0;
  },

  isNumber: function isNumber(x) {
    return typeof x === 'number';
  },

  isObject: function isObject(x) {
    return Object.prototype.toString.call(x) === '[object Object]';
  },

  isString: function isString(x) {
    return typeof x === 'string';
  },

  merge: function merge() {
    var obj = {};
    for (var i = 0; i < arguments.length; i++) {
      var argument = arguments[i];
      for (var key in argument) {
        if (!argument.hasOwnProperty(key)) {
          continue;
        }
        obj[key] = argument[key];
      }
    }
    return obj;
  }
};
