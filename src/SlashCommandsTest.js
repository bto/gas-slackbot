TestRunner.functions.push(function (test, common) {
  function createBot(params) {
    var bot = new Bot(createEvent(params));
    bot.setBotAccessToken(common.getProperty('SLACK_BOT_ACCESS_TOKEN'));
    bot.setVerificationToken(common.getProperty('SLACK_VERIFICATION_TOKEN'));
    return bot;
  }

  function createSlashCommands(params) {
    return new SlashCommands(createBot(params));
  }

  function createEvent(params) {
    return {
      parameter: Obj.merge({
        token: common.getProperty('SLACK_VERIFICATION_TOKEN')
      }, params ? params : {})
    };
  }

  test('registerSlashCommand()', function (assert) {
    var func = function () {};
    registerSlashCommand('/foo', func);
    assert.equal(SlashCommands.prototype.handlers['/foo'], func, 'register a slash command function');
  });

  test('new SlashCommands()', function (assert) {
    var slashCommands = new SlashCommands(createBot());
    assert.ok(slashCommands instanceof SlashCommands, 'creates SlashCommands object');

    assert.throws(
      function () {
        slashCommands = new SlashCommands(null);
      },
      'throws an exception if a bot object was not provided'
    );
  });

  test('SlashCommands.execute(): /ping', function (assert) {
    var slashCommands = createSlashCommands({command: '/ping'});
    assert.equal(slashCommands.execute(), 'PONG', 'has a valid content');
  });

  test('SlashCommands.verifyToken()', function (assert) {
    var slashCommands = createSlashCommands();

    assert.notOk(slashCommands.verifyToken('token'), 'returns false for an invalid verification token');

    var token = common.getProperty('SLACK_VERIFICATION_TOKEN');
    assert.ok(slashCommands.verifyToken(token), 'returns true for a valid verification token');
  });
});

/* eslint func-names: ["error", "never"] */
