testRunner.functions.push(function (test) {
  test('new Config()', function (assert) {
    var config = new SlackBot.Config();
    assert.ok(config instanceof SlackBot.Config, 'creates Config object');

    config = new SlackBot.Config({foo: {bar: 'baz'}});
    assert.ok(config instanceof SlackBot.Config, 'creates Config object');
    assert.deepEqual(config.get('foo'), {bar: 'baz'}, 'returns a valid value');
  });

  test('Config: get(), set()', function (assert) {
    var config = new SlackBot.Config();

    assert.deepEqual(config.get('foo'), {}, 'returns empty hash table');

    config.set('foo', {bar: 'baz'});
    var value = config.get('foo');
    assert.equal(value.bar, 'baz', 'returns a valid value');
  });

  test('Config: getAll(), setAll()', function (assert) {
    var config = new SlackBot.Config();

    config.setAll({foo: {bar: 'baz'}, bar: {foo: 'baz'}});
    var value = config.get('foo');
    assert.deepEqual(value, {bar: 'baz'}, 'returns a valid value');
    value = config.get('bar');
    assert.deepEqual(value, {foo: 'baz'}, 'returns a valid value');

    value = config.getAll();
    assert.deepEqual(value, {foo: {bar: 'baz'}, bar: {foo: 'baz'}}, 'returns a valid value');
  });

  test('Config: getCommon(), setCommon()', function (assert) {
    var config = new SlackBot.Config();
    config.set('foo', {bar: 'baz'});

    assert.notOk(config.getCommon('baz'), 'returns nothing');
    assert.deepEqual(config.get('foo'), {bar: 'baz'}, 'returns a valid value');

    config.setCommon('baz', 'foo');
    assert.deepEqual(config.get('foo'), {bar: 'baz', baz: 'foo'}, 'returns a valid value');
  });

  test('Config: getCommonAll(), setCommonAll()', function (assert) {
    var config = new SlackBot.Config();

    config.setCommonAll({foo: {bar: 'baz'}, bar: {foo: 'baz'}});
    var value = config.getCommon('foo');
    assert.deepEqual(value, {bar: 'baz'}, 'returns a valid value');
    value = config.getCommon('bar');
    assert.deepEqual(value, {foo: 'baz'}, 'returns a valid value');

    value = config.getCommonAll();
    assert.deepEqual(value, {foo: {bar: 'baz'}, bar: {foo: 'baz'}}, 'returns a valid value');
  });
});

/* eslint func-names: ["error", "never"] */
