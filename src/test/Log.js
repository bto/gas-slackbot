testRunner.functions.push(function (test) {
  test('new Log()', function (assert) {
    var log = new SlackBot.Log();
    assert.ok(log instanceof SlackBot.Log, 'creates Log object');
    assert.equal(log.level, SlackBot.Log.WARN, 'log level becomes WARN with no level argument');

    log = new SlackBot.Log(SlackBot.Log.DEBUG);
    assert.ok(log instanceof SlackBot.Log, 'creates Log object');
    assert.equal(log.level, SlackBot.Log.DEBUG, 'log level is same as a level argument');
  });

  test('Log.toString()', function (assert) {
    var log = new SlackBot.Log();
    log.error('foo');
    log.fatal('bar');
    var message = log.toString();
    assert.equal(typeof message, 'string', 'returns a string');
    assert.ok(message.length > 0, 'returns a message');
  });

  test('Log.write()', function (assert) {
    var log = new SlackBot.Log(SlackBot.Log.DEBUG);
    assert.equal(log.messages.length, 0, 'no log messages');

    log.debug('%s: %s: %s', 'foo', 'bar', 'baz');
    assert.equal(log.messages.length, 1, 'adds a log message');
    assert.equal(log.messages[0].level, SlackBot.Log.DEBUG, 'has a log level');
    assert.equal(log.messages[0].message, 'foo: bar: baz', 'has a message');
    assert.ok(log.messages[0].time, 'has time');

    log.level = SlackBot.Log.INFO;
    log.debug('foo');
    assert.equal(log.messages.length, 1, 'adds no log message');
  });
});

/* eslint func-names: ["error", "never"] */
