testRunner.functions.push(function (test) {
  test('new SlackBot()', function (assert) {
    var bot = new SlackBot();
    assert.ok(bot instanceof SlackBot, 'creates SlackBot object');

    assert.ok(Obj.isString(bot.getDefaultMessage()));
    assert.notEqual(bot.getDefaultMessage().length, 0);

    assert.ok(Obj.isString(bot.getUsername()));
    assert.notEqual(bot.getUsername().length, 0);
  });
});

/* eslint func-names: ["error", "never"] */
