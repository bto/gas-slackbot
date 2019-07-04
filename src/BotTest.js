TestRunner.functions.push(function (test, common) {
  function createObj(eventParams, params) {
    var bot = new Bot(createEvent(eventParams, params));
    bot.setBotAccessToken(common.getProperty('SLACK_BOT_ACCESS_TOKEN'));
    bot.setVerificationToken(common.getProperty('SLACK_VERIFICATION_TOKEN'));
    return bot;
  }

  function createEvent(eventParams, params) {
    var body = Obj.merge({
      event: Obj.merge({
        channel: common.getProperty('SLACK_CHANNEL_ID')
      }, eventParams ? eventParams : {}),
      token: common.getProperty('SLACK_VERIFICATION_TOKEN'),
      type: 'event_callback'
    }, params ? params : {});

    return {
      postData: {
        contents: JSON.stringify(body)
      }
    };
  }

  test('create()', function (assert) {
    var event = createEvent();
    var bot = create(event);
    assert.ok(bot instanceof Bot, 'creates Bot object');
    assert.equal(event, bot.getEvent(), 'set an event object');
  });

  test('registerBotCommand()', function (assert) {
    var func = function () {};
    registerBotCommand('foo', func);
    assert.equal(Bot.prototype.botCommands.foo, func, 'register a command function');
  });

  test('registerEventHandler()', function (assert) {
    var func = function () {};
    registerEventHandler('foo', func);
    assert.equal(Bot.prototype.eventHandlers.foo[0], func, 'register a event function');
  });

  test('new Bot()', function (assert) {
    var bot = createObj();
    assert.ok(bot instanceof Bot, 'creates Bot object');
  });

  test('Bot bot access token', function (assert) {
    var bot = createObj();

    var obj = bot.setBotAccessToken('bot access token');
    assert.equal(bot, obj, 'returns itself');
    assert.equal('bot access token', bot.getBotAccessToken(), 'set a bot access token');
  });

  test('Bot event object', function (assert) {
    var bot = createObj();

    var event = createEvent();
    var obj = bot.setEvent(event);
    assert.equal(bot, obj, 'returns itself');
    assert.deepEqual(event, bot.getEvent(), 'set an event object');
  });

  test('Bot verification token', function (assert) {
    var bot = createObj();

    var obj = bot.setVerificationToken('verification token');
    assert.equal(bot, obj, 'returns itself');
    assert.equal('verification token', bot.getVerificationToken(), 'set a verification token');
  });

  test('Bot.actAsEventsApi(): app_mention', function (assert) {
    var bot = createObj({
      type: 'app_mention',
      text: ''
    });
    assert.equal(bot.actAsEventsApi(), 'そんなコマンドはないよ。', 'has a valid content');
  });

  test('Bot.actAsEventsApi(): app_mention', function (assert) {
    var bot = createObj({
      type: 'app_mention',
      text: '<@Uxxx> help'
    });
    assert.equal(bot.actAsEventsApi(), '吾輩はBotである。ヘルプはまだない。', 'has a valid content');
  });

  test('Bot.actAsEventsApi(): app_mention', function (assert) {
    var bot = createObj({
      type: 'app_mention',
      text: '<@Uxxx> ping'
    });
    assert.equal(bot.actAsEventsApi(), 'PONG', 'has a valid content');
  });

  test('Bot.actAsEventsApi(): url_verification', function (assert) {
    var bot = createObj({}, {challenge: 'foo', type: 'url_verification'});
    assert.equal(bot.actAsEventsApi(), 'foo', 'has a valid content');
  });

  test('Bot.callEventHandlers()', function (assert) {
    var api = createObj({type: 'foo_event'});
    var f1Called = 0;
    var f2Called = 0;
    var eventsApi = new EventsApi(api.getEvent());

    var output = api.callEventHandlers(eventsApi);
    assert.equal(output, null, 'return null');
    assert.equal(f1Called, 0, 'first function was not called');
    assert.equal(f2Called, 0, 'second function was not called');

    registerEventHandler(
      'foo_event',
      function () {
        f1Called++;
      }
    );
    output = api.callEventHandlers(eventsApi);
    assert.equal(output, null, 'return null');
    assert.equal(f1Called, 1, 'first function was called');
    assert.equal(f2Called, 0, 'second function was not called');

    registerEventHandler(
      'foo_event',
      function () {
        f2Called++;
        return 'f2';
      }
    );
    output = api.callEventHandlers(eventsApi);
    assert.equal(output, 'f2', 'return a valid string');
    assert.equal(f1Called, 2, 'first function was called');
    assert.equal(f2Called, 1, 'second function was not called');
  });

  test('Bot.exeute(): url_verification', function (assert) {
    var bot = createObj({}, {challenge: 'foo', type: 'url_verification'});
    var output = bot.execute();
    assert.ok(Obj.isGASObject(output, 'TextOutput'), 'returns a TextOutput object');
    assert.equal(output.getMimeType(), ContentService.MimeType.TEXT, 'MimeType is TEXT');
    assert.equal(output.getContent(), 'foo', 'has a valid content');
  });
});

/* eslint func-names: ["error", "never"] */
