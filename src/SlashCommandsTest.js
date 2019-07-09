TestRunner.functions.push(function (test, common) {
  function createSlashCommands(params) {
    return new SlashCommands(common.createBot(params));
  }

  test('registerSlashCommand()', function (assert) {
    var func = function () {};
    registerSlashCommand('/foo', func);
    assert.equal(SlashCommands.prototype.handlers['/foo'], func, 'register a slash command function');
  });

  test('new SlashCommands()', function (assert) {
    var slashCommands = new SlashCommands(common.createBot());
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
    var output = slashCommands.execute();
    assert.equal(output.response_type, 'in_channel', 'output has a valid response_type');
    assert.equal(output.text, 'PONG', 'output has a valid text PONG');
  });

  test('SlashCommands.verifyToken()', function (assert) {
    var slashCommands = createSlashCommands();

    assert.notOk(slashCommands.verifyToken('token'), 'returns false for an invalid verification token');

    var token = common.getProperty('SLACK_VERIFICATION_TOKEN');
    assert.ok(slashCommands.verifyToken(token), 'returns true for a valid verification token');
  });
});

/* eslint func-names: ["error", "never"] */
