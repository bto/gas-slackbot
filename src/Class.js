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


SlackBot.Parent = function Parent() {
  Logger.log('SlackBot.Parent()');
  this.initialize();
};

SlackBot.Parent.prototype = {
  foo: 'bar',
  bar: 'foo',
  initialize: function initialize() {
    Logger.log('SlackBot.Parent.initialize()');
  }
};


SlackBot.Child1 = function Child1() {
  Logger.log('SlackBot.Child1()');
  this.initialize();
};

SlackBot.Class.extend(SlackBot.Child1, SlackBot.Parent, {
  foo: 'bar',
  bar: 'bar',

  initialize: function initialize() {
    Logger.log('SlackBot.Child1.initialize()');
    SlackBot.Child1._super(this, arguments);
  }
});


SlackBot.Child2 = function Child2() {
  Logger.log('SlackBot.Child2()');
  this.initialize();
};

SlackBot.Class.extend(SlackBot.Child2, SlackBot.Child1, {
  foo: 'baz',
  bar: 'baz',

  initialize: function initialize() {
    Logger.log('SlackBot.Child2.initialize()');
    SlackBot.Child2._super(this, arguments);
  }
});

/*
function testKlass() {
  var parent1 = new SlackBot.Parent();
  Logger.log('new SlackBot.Parent()');
  Logger.log(parent1.foo);
  Logger.log(parent1.bar);
  Logger.log('');

  var child1 = new SlackBot.Child1();
  Logger.log('new SlackBot.Child1()');
  Logger.log(child1.foo);
  Logger.log(child1.bar);
  Logger.log('');

  var child2 = new SlackBot.Child2();
  Logger.log('new SlackBot.Child2()');
  Logger.log(child2.foo);
  Logger.log(child2.bar);
  Logger.log('');

  return Logger.getLog();
}
*/
