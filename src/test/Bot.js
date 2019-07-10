TestRunner.functions.push(function (test, common) {
  test('new Bot()', function (assert) {
    var bot = common.createBot();
    assert.ok(bot instanceof Bot, 'creates Bot object');
  });

  test('Bot bot access token', function (assert) {
    var bot = common.createBot();

    var obj = bot.setBotAccessToken('bot access token');
    assert.equal(bot, obj, 'returns itself');
    assert.equal('bot access token', bot.getBotAccessToken(), 'set a bot access token');
  });

  test('Bot verification token', function (assert) {
    var bot = common.createBot();

    var obj = bot.setVerificationToken('verification token');
    assert.equal(bot, obj, 'returns itself');
    assert.equal('verification token', bot.getVerificationToken(), 'set a verification token');
  });

  test('Bot.exeute(): Events API command ping', function (assert) {
    var bot = common.createBot(null, {
      type: 'app_mention',
      text: '<@Uxxx> ping'
    });
    var output = bot.execute();
    assert.ok(Obj.isGASObject(output, 'TextOutput'), 'returns a TextOutput object');
    assert.equal(output.getMimeType(), ContentService.MimeType.TEXT, 'MimeType is TEXT');
    assert.equal(output.getContent(), 'PONG', 'has a valid content');
  });

  test('Bot.exeute(): Events API url_verification', function (assert) {
    var bot = common.createBot({challenge: 'foo', type: 'url_verification'});
    var output = bot.execute();
    assert.ok(Obj.isGASObject(output, 'TextOutput'), 'returns a TextOutput object');
    assert.equal(output.getMimeType(), ContentService.MimeType.TEXT, 'MimeType is TEXT');
    assert.equal(output.getContent(), 'foo', 'has a valid content');
  });

  test('Bot.exeute(): Slash Commands /ping', function (assert) {
    var bot = common.createBot({command: '/ping'});
    var output = bot.execute();
    assert.ok(Obj.isGASObject(output, 'TextOutput'), 'returns a TextOutput object');
    assert.equal(output.getMimeType(), ContentService.MimeType.JSON, 'MimeType is JSON');
    assert.equal(
      output.getContent(),
      JSON.stringify({
        response_type: 'in_channel',
        text: 'PONG'
      }),
      'has a valid content'
    );
  });
});

/* eslint func-names: ["error", "never"] */
