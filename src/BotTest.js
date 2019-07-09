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
      parameter: {},
      postData: {
        contents: JSON.stringify(body)
      }
    };
  }

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

  test('Bot verification token', function (assert) {
    var bot = createObj();

    var obj = bot.setVerificationToken('verification token');
    assert.equal(bot, obj, 'returns itself');
    assert.equal('verification token', bot.getVerificationToken(), 'set a verification token');
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
