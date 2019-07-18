function testRunner() {
  var gastap = new GasTap();
  var common = new TestCommon();

  var functions = testRunner.functions;
  for (var i = 0; i < functions.length; i++) {
    try {
      functions[i](gastap, common);
    } catch (error) {
      gastap('Exception occurred', function f(assert) {
        Logger.log(error);
        assert.fail(error);
      });
    }
  }

  gastap.finish();
  return Logger.getLog();
}

testRunner.functions = [];

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^testRunner$" }] */
