TestRunner.functions.push(function (test) {
  test('Obj.isArray()', function (assert) {
    assert.ok(SlackBot.Obj.isArray([]), 'returns true if an argument is an array');
    assert.notOk(SlackBot.Obj.isArray(1), 'returns false if an argument is a number');
    assert.notOk(SlackBot.Obj.isArray(''), 'returns false if an argument is a string');
    assert.notOk(SlackBot.Obj.isArray({}), 'returns false if an argument is an object');
  });

  test('Obj.isGASObject()', function (assert) {
    var gasObj = PropertiesService.getScriptProperties();

    assert.ok(SlackBot.Obj.isGASObject(gasObj), 'returns true if an argument is a GAS object');
    assert.ok(SlackBot.Obj.isGASObject(gasObj, 'ScriptProperties'), 'returns true if an argument is a ScriptProperties object');
    assert.notOk(SlackBot.Obj.isGASObject(1), 'returns false if an argument is an integer number');
    assert.notOk(SlackBot.Obj.isGASObject(''), 'returns false if an argument is a string');
    assert.notOk(SlackBot.Obj.isGASObject([]), 'returns false if an argument is an array');
    assert.notOk(SlackBot.Obj.isGASObject({}), 'returns false if an argument is an object');
  });

  test('Obj.isInteger()', function (assert) {
    assert.ok(SlackBot.Obj.isInteger(1), 'returns true if an argument is an integer number');
    assert.notOk(SlackBot.Obj.isInteger(1.1), 'returns false if an argument is a floating number');
    assert.notOk(SlackBot.Obj.isInteger(''), 'returns false if an argument is a string');
    assert.notOk(SlackBot.Obj.isInteger([]), 'returns false if an argument is an array');
    assert.notOk(SlackBot.Obj.isInteger({}), 'returns false if an argument is an object');
  });

  test('Obj.isNumber()', function (assert) {
    assert.ok(SlackBot.Obj.isNumber(1), 'returns true if an argument is an integer number');
    assert.ok(SlackBot.Obj.isNumber(1.1), 'returns true if an argument is a floating number');
    assert.notOk(SlackBot.Obj.isNumber(''), 'returns false if an argument is a string');
    assert.notOk(SlackBot.Obj.isNumber([]), 'returns false if an argument is an array');
    assert.notOk(SlackBot.Obj.isNumber({}), 'returns false if an argument is an object');
  });

  test('Obj.isString()', function (assert) {
    assert.ok(SlackBot.Obj.isString(''), 'returns true if an argument is a string');
    assert.notOk(SlackBot.Obj.isString(1), 'returns false if an argument is a number');
    assert.notOk(SlackBot.Obj.isString([]), 'returns false if an argument is an array');
    assert.notOk(SlackBot.Obj.isString({}), 'returns false if an argument is an object');
  });

  test('Obj.isObject()', function (assert) {
    assert.ok(SlackBot.Obj.isObject({}), 'returns true if an argument is an object');
    assert.notOk(SlackBot.Obj.isObject(1), 'returns false if an argument is a number');
    assert.notOk(SlackBot.Obj.isObject(''), 'returns false if an argument is a string');
    assert.notOk(SlackBot.Obj.isObject([]), 'returns false if an argument is an array');
  });

  test('Obj.merge()', function (assert) {
    var a = {foo: 'foo'};
    var b = {bar: 'bar'};
    var c = {bar: 'baz'};
    var expected = {foo: 'foo', bar: 'baz'};
    assert.deepEqual(SlackBot.Obj.merge(a, b, c), expected, 'merges objects');
  });
});

/* eslint func-names: ["error", "never"] */
