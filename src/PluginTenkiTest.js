testRunner.functions.push(function (test) {
  test('new PluginTenki()', function (assert) {
    var plugin = new PluginTenki();
    assert.ok(plugin.exec());
  });
});

/* eslint func-names: ["error", "never"] */
