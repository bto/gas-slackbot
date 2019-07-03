TestRunner.functions.push(function (test, common) {
  function createObj(eventParams, params) {
    var botApp = new BotApp(createEvent(eventParams, params));
    botApp.setBotAccessToken(common.getProperty('SLACK_BOT_ACCESS_TOKEN'));
    botApp.setVerificationToken(common.getProperty('SLACK_VERIFICATION_TOKEN'));
    return botApp;
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

  test('createApp()', function (assert) {
    var event = createEvent();
    var botApp = createApp(event);
    assert.ok(botApp instanceof BotApp, 'creates BotApp object');
    assert.equal(event, botApp.getEvent(), 'set an event object');
  });

  test('registerBotCommand()', function (assert) {
    var func = function () {};
    registerBotCommand('foo', func);
    assert.equal(BotApp.prototype.botCommands.foo, func, 'register a command function');
  });

  test('registerEventHandler()', function (assert) {
    var func = function () {};
    registerEventHandler('foo', func);
    assert.equal(BotApp.prototype.eventHandlers.foo[0], func, 'register a event function');
  });

  test('new BotApp()', function (assert) {
    var botApp = createObj();
    assert.ok(botApp instanceof BotApp, 'creates BotApp object');
  });

  test('BotApp bot access token', function (assert) {
    var botApp = createObj();

    var obj = botApp.setBotAccessToken('bot access token');
    assert.equal(botApp, obj, 'returns itself');
    assert.equal('bot access token', botApp.getBotAccessToken(), 'set a bot access token');
  });

  test('BotApp event object', function (assert) {
    var botApp = createObj();

    var event = createEvent();
    var obj = botApp.setEvent(event);
    assert.equal(botApp, obj, 'returns itself');
    assert.deepEqual(event, botApp.getEvent(), 'set an event object');
  });

  test('BotApp verification token', function (assert) {
    var botApp = createObj();

    var obj = botApp.setVerificationToken('verification token');
    assert.equal(botApp, obj, 'returns itself');
    assert.equal('verification token', botApp.getVerificationToken(), 'set a verification token');
  });

  test('BotApp.actAsEventsApi(): app_mention', function (assert) {
    var botApp = createObj({
      type: 'app_mention',
      text: ''
    });
    assert.equal(botApp.actAsEventsApi(), 'そんなコマンドはないよ。', 'has a valid content');
  });

  test('BotApp.actAsEventsApi(): app_mention', function (assert) {
    var botApp = createObj({
      type: 'app_mention',
      text: '<@Uxxx> help'
    });
    assert.equal(botApp.actAsEventsApi(), '吾輩はBotである。ヘルプはまだない。', 'has a valid content');
  });

  test('BotApp.actAsEventsApi(): app_mention', function (assert) {
    var botApp = createObj({
      type: 'app_mention',
      text: '<@Uxxx> ping'
    });
    assert.equal(botApp.actAsEventsApi(), 'PONG', 'has a valid content');
  });

  test('BotApp.actAsEventsApi(): url_verification', function (assert) {
    var botApp = createObj({}, {challenge: 'foo', type: 'url_verification'});
    assert.equal(botApp.actAsEventsApi(), 'foo', 'has a valid content');
  });

  test('BotApp.exeute(): url_verification', function (assert) {
    var botApp = createObj({}, {challenge: 'foo', type: 'url_verification'});
    var output = botApp.execute();
    assert.ok(Obj.isGASObject(output, 'TextOutput'), 'returns a TextOutput object');
    assert.equal(output.getMimeType(), ContentService.MimeType.TEXT, 'MimeType is TEXT');
    assert.equal(output.getContent(), 'foo', 'has a valid content');
  });
});

/* eslint func-names: ["error", "never"] */
