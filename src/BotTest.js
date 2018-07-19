testRunner.functions.push(function (test) {
  function createBot() {
    var bot = new Bot(createEvent());

    var properties = PropertiesService.getUserProperties();
    bot.setAccessToken(properties.getProperty('TEST_SLACK_ACCESS_TOKEN'));

    return bot;
  }

  function createEvent() {
    var properties = PropertiesService.getUserProperties();
    return {
      parameter: {
        channel_id: properties.getProperty('TEST_SLACK_CHANNEL_ID'),
        token: properties.getProperty('TEST_SLACK_VERIFICATION_TOKEN')
      }
    };
  }

  test('command()', function (assert) {
    var func = function () {};
    command('foo', func);
    assert.equal(Bot.prototype.commands.foo, func, 'register a command function');
  });

  test('create()', function (assert) {
    var event = createEvent();
    var bot = create(event);
    assert.ok(bot instanceof Bot, 'creates Bot object');
    assert.equal(event, bot.getEvent(), 'set an event object');
  });

  test('new Bot()', function (assert) {
    var bot = createBot();
    assert.ok(bot instanceof Bot, 'creates Bot object');
  });

  test('Bot access token', function (assert) {
    var bot = createBot();

    var obj = bot.setAccessToken('access token');
    assert.equal(bot, obj, 'returns itself');
    assert.equal('access token', bot.getAccessToken(), 'set an access token');
  });

  test('Bot default message', function (assert) {
    var bot = createBot();

    var message = bot.getDefaultMessage();
    assert.ok(typeof message === 'string', 'if message was a string');
    assert.notEqual(message.length, 0, 'if message was not an empty string');

    var obj = bot.setDefaultMessage('default message');
    assert.equal(bot, obj, 'returns itself');
    assert.equal('default message', bot.getDefaultMessage(), 'set a default message');
  });

  test('Bot channel id', function (assert) {
    var bot = createBot();

    var obj = bot.setChannelId('channel id');
    assert.equal(bot, obj, 'returns itself');
    assert.equal('channel id', bot.getChannelId(), 'set a channel id');
  });

  test('Bot event object', function (assert) {
    var bot = createBot();

    var event = createEvent();
    var obj = bot.setEvent(event);
    assert.equal(bot, obj, 'returns itself');
    assert.deepEqual(event, bot.getEvent(), 'set an event object');
  });

  test('Bot username', function (assert) {
    var bot = createBot();

    var username = bot.getUsername();
    assert.ok(typeof username === 'string', 'if username was a string');
    assert.notEqual(username.length, 0, 'if username was not an empty string');

    var obj = bot.setUsername('username');
    assert.equal(bot, obj, 'returns itself');
    assert.equal('username', bot.getUsername(), 'set a username');
  });

  test('Bot verification token', function (assert) {
    var bot = createBot();

    var obj = bot.setVerificationToken('verification token');
    assert.equal(bot, obj, 'returns itself');
    assert.equal('verification token', bot.getVerificationToken(), 'set a verification token');
  });

  test('Bot.getApi()', function (assert) {
    var bot = createBot();

    assert.throws(
      function () {
        bot.setAccessToken(null);
        bot.getApi();
      },
      'throws an exception if access token was not provided'
    );

    bot.setAccessToken('access token');
    var api = bot.getApi();
    assert.ok(api instanceof SlackApp.SlackApp, 'return SlackApp object');
  });

  test('Bot.getRequestParam()', function (assert) {
    var bot = createBot();

    var channelId = PropertiesService.getUserProperties().getProperty('TEST_SLACK_CHANNEL_ID');
    assert.equal(bot.getRequestParam('channel_id'), channelId, 'return a request parameter');
  });

  test('Bot.send()', function () {
    var bot = createBot();

    var properties = PropertiesService.getUserProperties();
    bot.setAccessToken(properties.getProperty('TEST_SLACK_ACCESS_TOKEN'));
    bot.setChannelId(properties.getProperty('TEST_SLACK_CHANNEL_ID'));

    bot.send('Test: Bot.send()');
  });

  test('Bot.verify()', function (assert) {
    var bot = createBot();

    bot.setVerificationToken('token');
    assert.notOk(bot.verify(), 'return false for an invalid verification token');

    var token = PropertiesService.getUserProperties().getProperty('TEST_SLACK_VERIFICATION_TOKEN');
    bot.setVerificationToken(token);
    assert.ok(bot.verify(), 'return true for a valid verification token');
  });
});

/* eslint func-names: ["error", "never"] */
