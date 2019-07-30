SlackBot.Class = {
  extend: function extend(childClass, parentClass, proto) {
    childClass._super = function _super(obj, args) {
      return parentClass.prototype[args.callee.name].apply(obj, args);
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
