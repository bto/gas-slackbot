testRunner.functions.push(function (test, common) {
  function createController(params, eventParams) {
    var di = common.createDI(params, eventParams);
    return di.getShared('controller');
  }

  test('new Controller()', function (assert) {
    var controller = new SlackBot.Controller();
    assert.ok(controller instanceof SlackBot.Controller, 'creates Controller object');
  });

  test('Controller.createModule()', function (assert) {
    var controller = createController();
    var module = controller.createModule();
    assert.ok(module instanceof SlackBot.EventsApi, 'creates EventsApi object');

    controller = createController({text: 'foo'});
    module = controller.createModule();
    assert.ok(module instanceof SlackBot.OutgoingWebhook, 'creates OutgoingWebhook object');

    controller = createController({command: '/foo'});
    module = controller.createModule();
    assert.ok(module instanceof SlackBot.SlashCommands, 'creates SlashCommands object');
  });

  test('Controller.createOutputJson()', function (assert) {
    var controller = createController();
    var output = controller.createOutputJson({text: 'foo'});
    assert.ok(SlackBot.Obj.isGASObject(output, 'TextOutput'), 'returns a TextOutput object');
    assert.equal(output.getMimeType(), ContentService.MimeType.JSON, 'MimeType is JSON');
    assert.equal(output.getContent(), JSON.stringify({text: 'foo'}), 'has a valid content');
  });

  test('Controller.createOutputText()', function (assert) {
    var controller = createController();

    var output = controller.createOutputText();
    assert.ok(SlackBot.Obj.isGASObject(output, 'TextOutput'), 'returns a TextOutput object');
    assert.equal(output.getMimeType(), ContentService.MimeType.TEXT, 'MimeType is TEXT');
    assert.equal(output.getContent(), '', 'has a valid content');

    output = controller.createOutputText('foo');
    assert.ok(SlackBot.Obj.isGASObject(output, 'TextOutput'), 'returns a TextOutput object');
    assert.equal(output.getMimeType(), ContentService.MimeType.TEXT, 'MimeType is TEXT');
    assert.equal(output.getContent(), 'foo', 'has a valid content');
  });

  test('Controller.exeute(): Events API command ping', function (assert) {
    var controller = createController(null, {
      type: 'app_mention',
      text: '<@Uxxx> ping'
    });
    var output = controller.execute();
    assert.ok(SlackBot.Obj.isGASObject(output, 'TextOutput'), 'returns a TextOutput object');
    assert.equal(output.getMimeType(), ContentService.MimeType.TEXT, 'MimeType is TEXT');
    assert.equal(output.getContent(), '', 'has a valid content');
  });

  test('Controller.exeute(): Events API url_verification', function (assert) {
    var controller = createController({challenge: 'foo', type: 'url_verification'});
    var output = controller.execute();
    assert.ok(SlackBot.Obj.isGASObject(output, 'TextOutput'), 'returns a TextOutput object');
    assert.equal(output.getMimeType(), ContentService.MimeType.TEXT, 'MimeType is TEXT');
    assert.equal(output.getContent(), 'foo', 'has a valid content');
  });

  test('Controller.exeute(): Outgoing Webhook', function (assert) {
    var controller = createController({text: 'foo'});
    var output = controller.execute();
    assert.ok(SlackBot.Obj.isGASObject(output, 'TextOutput'), 'returns a TextOutput object');
    assert.equal(output.getMimeType(), ContentService.MimeType.JSON, 'MimeType is JSON');
    assert.equal(output.getContent(), JSON.stringify({text: 'foo'}), 'has a valid content');
  });

  test('Controller.exeute(): Slash Commands /ping', function (assert) {
    var controller = createController({command: '/ping'});
    var output = controller.execute();
    assert.ok(SlackBot.Obj.isGASObject(output, 'TextOutput'), 'returns a TextOutput object');
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

  test('Controller.finish()', function (assert) {
    var controller = createController();

    var output = controller.finish();
    assert.ok(SlackBot.Obj.isGASObject(output, 'TextOutput'), 'returns a TextOutput object');
    assert.equal(output.getMimeType(), ContentService.MimeType.TEXT, 'MimeType is TEXT');
    assert.equal(output.getContent(), '', 'has a valid content');

    output = controller.finish('foo');
    assert.ok(SlackBot.Obj.isGASObject(output, 'TextOutput'), 'returns a TextOutput object');
    assert.equal(output.getMimeType(), ContentService.MimeType.TEXT, 'MimeType is TEXT');
    assert.equal(output.getContent(), '', 'has a valid content');

    output = controller.finish({text: 'foo'});
    assert.ok(SlackBot.Obj.isGASObject(output, 'TextOutput'), 'returns a TextOutput object');
    assert.equal(output.getMimeType(), ContentService.MimeType.JSON, 'MimeType is JSON');
    assert.equal(output.getContent(), JSON.stringify({text: 'foo'}), 'has a valid content');

    var content = ContentService.createTextOutput('foo').setMimeType(ContentService.MimeType.TEXT);
    output = controller.finish(content);
    assert.equal(output, content, 'returns a same object');
  });

  test('Controller.getChannelId()', function (assert) {
    var controller = createController();
    assert.equal(controller.getChannelId(), common.getProperty('SLACK_CHANNEL_ID'), 'returns a channel id');

    controller.module = controller.createModule();
    assert.equal(controller.getChannelId(), common.getProperty('SLACK_CHANNEL_ID'), 'returns a channel id');
  });

  test('Controller.send()', function (assert) {
    var controller = createController();

    assert.ok(controller.send(), 'returns true');
    assert.ok(controller.send('foo'), 'returns true');
  });

  test('Controller.verifyToken()', function (assert) {
    var controller = createController();

    assert.throws(
      function () {
        controller.verifyToken('token');
      },
      'throws an error for an invalid verification token'
    );

    assert.notThrow(
      function () {
        controller.verifyToken(common.getProperty('SLACK_VERIFICATION_TOKEN'));
      },
      'not throw any exception'
    );
  });
});

/* eslint func-names: ["error", "never"] */
