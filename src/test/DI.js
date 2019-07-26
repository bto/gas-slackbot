testRunner.functions.push(function (test) {
  test('new DI()', function (assert) {
    var di = new SlackBot.DI();
    assert.ok(di instanceof SlackBot.DI, 'creates DI object');

    var config = di.get('config');
    assert.ok(config instanceof SlackBot.Config, 'Config object was set by default');

    di = new SlackBot.DI({
      foo: function () {
        return new SlackBot.Config();
      }
    });
    assert.ok(di instanceof SlackBot.DI, 'creates DI object');
    assert.ok(di.get('foo') instanceof SlackBot.Config, 'returns a Config object');
  });

  test('DI: get(), set()', function (assert) {
    var di = new SlackBot.DI();

    assert.notOk(di.get('foo'), 'returns nothing');

    di.set('foo', function (config) {
      assert.equal(config.foo, 'bar', 'passes config values');
      return new SlackBot.Config();
    });
    di.getShared('config').set('foo', {foo: 'bar'});
    var obj = di.get('foo');
    assert.ok(obj instanceof SlackBot.Config, 'returns a Config object');
  });

  test('DI.getShared()', function (assert) {
    var di = new SlackBot.DI({
      foo: function () {
        return new SlackBot.Config();
      }
    });

    var foo1 = di.getShared('foo');
    var foo2 = di.getShared('foo');
    assert.ok(foo1 instanceof SlackBot.Config, 'returns a Config object');
    assert.ok(foo2 instanceof SlackBot.Config, 'returns a Config object');
    assert.equal(foo1, foo2, 'same object');
  });

  test('DI.setAll()', function (assert) {
    var di = new SlackBot.DI();

    di.setAll({
      foo: function () {
        return new SlackBot.Config();
      },
      bar: function () {
        return new SlackBot.Config();
      }
    });
    var foo = di.get('foo');
    var bar = di.get('bar');
    assert.ok(foo instanceof SlackBot.Config, 'returns a Config object');
    assert.ok(bar instanceof SlackBot.Config, 'returns a Config object');
    assert.notEqual(foo, bar, 'not same object');
  });
});

/* eslint func-names: ["error", "never"] */
