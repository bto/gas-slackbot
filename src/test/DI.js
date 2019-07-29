testRunner.functions.push(function (test) {
  test('new DI()', function (assert) {
    var di = new SlackBot.DI();
    assert.ok(di instanceof SlackBot.DI, 'creates DI object');

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

    di.set('foo', function (diObj) {
      assert.equal(diObj, di, 'passes di object');
      return new SlackBot.Config();
    });
    var obj = di.get('foo');
    assert.ok(obj instanceof SlackBot.Config, 'returns a Config object');

    var obj1 = new SlackBot.Config();
    di.set('bar', obj1);
    var obj2 = di.get('bar');
    assert.ok(obj2 instanceof SlackBot.Config, 'returns a Config object');
    assert.equal(obj2, obj1, 'same object');
  });

  test('DI: getShared(), setShared()', function (assert) {
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

    var bar = {};
    assert.notOk(di.getShared('bar'), 'returns nothing');
    di.setShared('bar', bar);
    assert.equal(di.getShared('bar'), bar, 'returns a same object');
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
