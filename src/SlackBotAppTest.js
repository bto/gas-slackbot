testRunner.functions.push(function (test) {
  test('new SlackBot()', function (assert) {
    var bot = new SlackBot();
    assert.ok(bot instanceof SlackBot, 'creates SlackBot object');
  });

  test('SlackBot access token', function (assert) {
    var bot = new SlackBot();

    var obj = bot.setAccessToken('access token');
    assert.equal(bot, obj, 'returns itself');
    assert.equal('access token', bot.getAccessToken(), 'set an access token');
  });

  test('SlackBot default message', function (assert) {
    var bot = new SlackBot();

    var message = bot.getDefaultMessage();
    assert.ok(typeof message === 'string', 'if message was a string');
    assert.notEqual(message.length, 0, 'if message was not an empty string');

    var obj = bot.setDefaultMessage('default message');
    assert.equal(bot, obj, 'returns itself');
    assert.equal('default message', bot.getDefaultMessage(), 'set a default message');
  });

  test('SlackBot request object', function (assert) {
    var bot = new SlackBot();
    var request = {
      parameter: {
        channel_id: 'channel_id'
      }
    };

    var obj = bot.setRequest(request);
    assert.equal(bot, obj, 'returns itself');
    assert.deepEqual(request, bot.getRequest(), 'set a request object');
  });

  test('SlackBot username', function (assert) {
    var bot = new SlackBot();

    var username = bot.getUsername();
    assert.ok(typeof username === 'string', 'if username was a string');
    assert.notEqual(username.length, 0, 'if username was not an empty string');

    var obj = bot.setUsername('username');
    assert.equal(bot, obj, 'returns itself');
    assert.equal('username', bot.getUsername(), 'set a username');
  });

  test('SlackBot verification token', function (assert) {
    var bot = new SlackBot();

    var obj = bot.setAccessToken('verification token');
    assert.equal(bot, obj, 'returns itself');
    assert.equal('verification token', bot.getAccessToken(), 'set a verification token');
  });
});

/* eslint func-names: ["error", "never"] */
