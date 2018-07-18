testRunner.functions.push(function (test) {
  test('new SlackBot()', function (assert) {
    var bot = new SlackBot();
    assert.ok(bot instanceof SlackBot, 'creates SlackBot object');

    var str = bot.getDefaultMessage();
    assert.ok(typeof str === 'string', 'if message was a string');
    assert.notEqual(str.length, 0, 'if message was not an empty string');

    str = bot.getUsername();
    assert.ok(typeof str === 'string', 'if username was a string');
    assert.notEqual(str.length, 0, 'if username was not an empty string');
  });
});

/* eslint func-names: ["error", "never"] */
