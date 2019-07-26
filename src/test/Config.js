testRunner.functions.push(function (test) {
  test('new Config()', function (assert) {
    var config = new SlackBot.Config();
    assert.ok(config instanceof SlackBot.Config, 'creates Config object');

    config = new SlackBot.Config({foo: 'bar'});
    assert.ok(config instanceof SlackBot.Config, 'creates Config object');
    assert.equal(config.get('foo'), 'bar', 'returns a valid value');
  });

  test('Config: get(), set()', function (assert) {
    var config = new SlackBot.Config();

    assert.notOk(config.get('foo'), 'returns nothing');

    config.set('foo', {bar: 'baz'});
    var value = config.get('foo');
    assert.equal(value.bar, 'baz', 'returns a valid value');
  });

  test('Config: getAll(), setAll()', function (assert) {
    var config = new SlackBot.Config();

    config.setAll({foo: {bar: 'baz'}, bar: 'baz'});
    var value = config.get('foo');
    assert.equal(value.bar, 'baz', 'returns a valid value');
    value = config.get('bar');
    assert.equal(value, 'baz', 'returns a valid value');

    value = config.getAll();
    assert.deepEqual(value, {foo: {bar: 'baz'}, bar: 'baz'}, 'returns a valid value');
  });
});

/* eslint func-names: ["error", "never"] */
