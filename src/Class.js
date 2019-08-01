var Class = {
  extend: function extend(childClass, parentClass, proto) {
    childClass._super = function _super(args) {
      return parentClass.prototype[args.callee.name];
    };

    childClass.prototype = Object.create(parentClass.prototype);

    var protoObj = proto ? proto : {};
    for (var key in protoObj) {
      if (!protoObj.hasOwnProperty(key)) {
        continue;
      }
      childClass.prototype[key] = protoObj[key];
    }
  }
};

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^Class$" }] */
