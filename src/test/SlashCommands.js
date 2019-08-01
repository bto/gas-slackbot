testRunner.functions.push(function (test, common) {
  function createSlashCommands(params) {
    return new SlashCommands(common.createDI(params));
  }

  test('registerSlashCommand()', function (assert) {
    var func = function () {};
    registerSlashCommand('/foo', func);
    assert.equal(SlashCommands.prototype.handlers['/foo'], func, 'register a slash command function');
  });

  test('new SlashCommands()', function (assert) {
    var slashCommands = new SlashCommands(common.createDI());
    assert.ok(slashCommands instanceof SlashCommands, 'creates SlashCommands object');

    assert.throws(
      function () {
        slashCommands = new SlashCommands();
      },
      'throws an exception if a DI object was not provided'
    );
  });

  test('SlashCommands.execute(): /ping', function (assert) {
    var slashCommands = createSlashCommands({command: '/ping'});
    var output = slashCommands.execute();
    assert.equal(output.response_type, 'in_channel', 'output has a valid response_type');
    assert.equal(output.text, 'PONG', 'output has a valid text PONG');
  });

  test('SlashCommands.getArgs()', function (assert) {
    var slashCommands = createSlashCommands();
    var args;

    slashCommands.params.text = null;
    args = slashCommands.getArgs();
    assert.deepEqual(args, [], 'returns an empty array');

    slashCommands.params.text = '';
    args = slashCommands.getArgs();
    assert.deepEqual(args, [], 'returns an empty array');

    slashCommands.params.text = '  foo  ';
    args = slashCommands.getArgs();
    assert.deepEqual(args, ['foo'], 'returns a valid array');

    slashCommands.params.text = '  foo  bar  ';
    args = slashCommands.getArgs();
    assert.deepEqual(args, ['foo', 'bar'], 'returns a valid array');
  });
});

/* eslint func-names: ["error", "never"] */
