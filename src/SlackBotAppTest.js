testRunner.functions.push(function (test) {
  var event = {
    parameter: {
      channel_id: 'channelId',
      token: 'verification token'
    }
  };

  function createBot() {
    return new SlackBot(event);
  }

  test('command()', function (assert) {
    var func = function () {};
    command('foo', func);
    assert.equal(SlackBot.prototype.commands.foo, func, 'register a command function');
  });

  test('create()', function (assert) {
    var bot = create(event);
    assert.ok(bot instanceof SlackBot, 'creates SlackBot object');
    assert.equal(event, bot.getEvent(), 'set an event object');
  });

  test('new SlackBot()', function (assert) {
    var bot = createBot();
    assert.ok(bot instanceof SlackBot, 'creates SlackBot object');
  });

  test('SlackBot access token', function (assert) {
    var bot = createBot();

    var obj = bot.setAccessToken('access token');
    assert.equal(bot, obj, 'returns itself');
    assert.equal('access token', bot.getAccessToken(), 'set an access token');
  });

  test('SlackBot default message', function (assert) {
    var bot = createBot();

    var message = bot.getDefaultMessage();
    assert.ok(typeof message === 'string', 'if message was a string');
    assert.notEqual(message.length, 0, 'if message was not an empty string');

    var obj = bot.setDefaultMessage('default message');
    assert.equal(bot, obj, 'returns itself');
    assert.equal('default message', bot.getDefaultMessage(), 'set a default message');
  });

  test('SlackBot channel id', function (assert) {
    var bot = createBot();

    var obj = bot.setChannelId('channel id');
    assert.equal(bot, obj, 'returns itself');
    assert.equal('channel id', bot.getChannelId(), 'set a channel id');
  });

  test('SlackBot event object', function (assert) {
    var bot = createBot();

    var obj = bot.setEvent(event);
    assert.equal(bot, obj, 'returns itself');
    assert.deepEqual(event, bot.getEvent(), 'set an event object');
  });

  test('SlackBot username', function (assert) {
    var bot = createBot();

    var username = bot.getUsername();
    assert.ok(typeof username === 'string', 'if username was a string');
    assert.notEqual(username.length, 0, 'if username was not an empty string');

    var obj = bot.setUsername('username');
    assert.equal(bot, obj, 'returns itself');
    assert.equal('username', bot.getUsername(), 'set a username');
  });

  test('SlackBot verification token', function (assert) {
    var bot = createBot();

    var obj = bot.setVerificationToken('verification token');
    assert.equal(bot, obj, 'returns itself');
    assert.equal('verification token', bot.getVerificationToken(), 'set a verification token');
  });

  test('SlackBot.getApi()', function (assert) {
    var bot = createBot();

    assert.throws(
      function () {
        bot.getApi();
      },
      'throws an exception if access token was not provided'
    );

    bot.setAccessToken('access token');
    var api = bot.getApi();
    assert.ok(api instanceof SlackApp.SlackApp, 'return SlackApp object');
  });

  test('SlackBot.getRequestParam()', function (assert) {
    var bot = createBot();
    assert.equal(bot.getRequestParam('channel_id'), 'channelId', 'return a request parameter');
  });

  test('SlackBot.send()', function () {
    var bot = createBot();
    var properties = PropertiesService.getUserProperties();
    bot.setAccessToken(properties.getProperty('TEST_SLACK_ACCESS_TOKEN'));
    bot.setChannelId(properties.getProperty('TEST_SLACK_CHANNEL_ID'));
    bot.send('Test: SlackBot.send()');
  });

  test('SlackBot.verify()', function (assert) {
    var bot = createBot();

    bot.setVerificationToken('token');
    assert.notOk(bot.verify(), 'return false for an invalid verification token');

    bot.setVerificationToken('verification token');
    assert.ok(bot.verify(), 'return true for a valid verification token');
  });
});

/* eslint func-names: ["error", "never"] */
