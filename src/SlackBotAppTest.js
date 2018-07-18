testRunner.functions.push(function (test) {
  test('new SlackBot()', function (assert) {
    var bot = new SlackBot();
    assert.ok(bot instanceof SlackBot, 'creates SlackBot object');
  });

  test('SlackBot default message', function (assert) {
    var bot = new SlackBot();

    var message = bot.getDefaultMessage();
    assert.ok(typeof message === 'string', 'if message was a string');
    assert.notEqual(message.length, 0, 'if message was not an empty string');

    var obj = bot.setDefaultMessage('default message');
    assert.equal(bot, obj, 'returns itself');
    assert.equal('default message', bot.getDefaultMessage(), 'set default message');
  });

  test('SlackBot username', function (assert) {
    var bot = new SlackBot();

    var username = bot.getUsername();
    assert.ok(typeof username === 'string', 'if username was a string');
    assert.notEqual(username.length, 0, 'if username was not an empty string');

    var obj = bot.setUsername('username');
    assert.equal(bot, obj, 'returns itself');
    assert.equal('username', bot.getUsername(), 'set username');
  });
});

/* eslint func-names: ["error", "never"] */
