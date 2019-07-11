function testAppRunner() {
  return (new TestRunner()).runApp();
}

function testCliRunner() {
  return (new TestRunner()).runCli();
}


var TestRunner = function TestRunner() {
  this.initialize();
};

TestRunner.functions = [];

TestRunner.prototype = {
  initialize: function initialize() {
    this.functions = TestRunner.functions;
  },

  run: function run(gastOpts) {
    var test = new GasTap(gastOpts);
    var common = new TestCommon();

    var functions = this.functions;
    for (var i = 0; i < functions.length; i++) {
      try {
        functions[i](test, common);
      } catch (error) {
        test('Exception occurred', function f(assert) {
          Logger.log(error);
          assert.fail(error);
        });
      }
    }

    test.finish();
  },

  runApp: function runApp() {
    return this.run();
  },

  runCli: function runCli() {
    var testMessage = '';
    this.run({
      logger: function logger(msg) { testMessage += msg + '\n'; }
    });
    return testMessage;
  }
};

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^testAppRunner|testCliRunner$" }] */