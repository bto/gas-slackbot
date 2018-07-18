testRunner.functions.push(function (test) {
  var event = {
    parameter: {
      channel_id: 'channelId'
    }
  };

  test('command()', function (assert) {
    var func = function () {};
    command('foo', func);
    assert.equal(SlackBot.prototype.commands.foo, func, 'register a command function');
  });

  test('create()', function (assert) {
    var bot = create();
    assert.ok(bot instanceof SlackBot, 'creates SlackBot object');
  });

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

  test('SlackBot channel id', function (assert) {
    var bot = new SlackBot();

    var obj = bot.setChannelId('channel id');
    assert.equal(bot, obj, 'returns itself');
    assert.equal('channel id', bot.getChannelId(), 'set a channel id');
  });

  test('SlackBot event object', function (assert) {
    var bot = new SlackBot();

    var obj = bot.setEvent(event);
    assert.equal(bot, obj, 'returns itself');
    assert.deepEqual(event, bot.getEvent(), 'set an event object');
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

  test('SlackBot.getRequestParam()', function (assert) {
    var bot = new SlackBot();
    bot.setEvent(event);

    assert.equal(bot.getRequestParam('channel_id'), 'channelId', 'return a request parameter');
  });
});

/* eslint func-names: ["error", "never"] */
