testRunner.functions.push(function (test, common) {
  test('new Controller()', function (assert) {
    var controller = common.createController();
    assert.ok(controller instanceof SlackBot.Controller, 'creates Controller object');
  });

  test('Controller bot access token', function (assert) {
    var controller = common.createController();

    var obj = controller.setBotAccessToken('bot access token');
    assert.equal(controller, obj, 'returns itself');
    assert.equal(controller.getBotAccessToken(), 'bot access token', 'set a bot access token');
  });

  test('Controller channel id', function (assert) {
    var controller = common.createController();

    var obj = controller.setChannelId('channel id');
    assert.equal(controller, obj, 'returns itself');
    assert.equal(controller.getChannelId(), 'channel id', 'returns a channel id');

    controller.module = controller.createModule();
    assert.equal(controller.getChannelId(), common.getProperty('SLACK_CHANNEL_ID'), 'returns a channel id');
  });

  test('Controller verification token', function (assert) {
    var controller = common.createController();

    var obj = controller.setVerificationToken('verification token');
    assert.equal(controller, obj, 'returns itself');
    assert.equal(controller.getVerificationToken(), 'verification token', 'set a verification token');
  });

  test('Controller.createModule()', function (assert) {
    var controller = common.createController();
    var module = controller.createModule();
    assert.ok(module instanceof SlackBot.EventsApi, 'creates EventsApi object');

    controller = common.createController({text: 'foo'});
    module = controller.createModule();
    assert.ok(module instanceof SlackBot.OutgoingWebhook, 'creates OutgoingWebhook object');

    controller = common.createController({command: '/foo'});
    module = controller.createModule();
    assert.ok(module instanceof SlackBot.SlashCommands, 'creates SlashCommands object');
  });

  test('Controller.createOutputJson()', function (assert) {
    var controller = common.createController();
    var output = controller.createOutputJson({text: 'foo'});
    assert.ok(SlackBot.Obj.isGASObject(output, 'TextOutput'), 'returns a TextOutput object');
    assert.equal(output.getMimeType(), ContentService.MimeType.JSON, 'MimeType is JSON');
    assert.equal(output.getContent(), JSON.stringify({text: 'foo'}), 'has a valid content');
  });

  test('Controller.createOutputText()', function (assert) {
    var controller = common.createController();

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
    var controller = common.createController(null, {
      type: 'app_mention',
      text: '<@Uxxx> ping'
    });
    var output = controller.execute();
    assert.ok(SlackBot.Obj.isGASObject(output, 'TextOutput'), 'returns a TextOutput object');
    assert.equal(output.getMimeType(), ContentService.MimeType.TEXT, 'MimeType is TEXT');
    assert.equal(output.getContent(), '', 'has a valid content');
  });

  test('Controller.exeute(): Events API url_verification', function (assert) {
    var controller = common.createController({challenge: 'foo', type: 'url_verification'});
    var output = controller.execute();
    assert.ok(SlackBot.Obj.isGASObject(output, 'TextOutput'), 'returns a TextOutput object');
    assert.equal(output.getMimeType(), ContentService.MimeType.TEXT, 'MimeType is TEXT');
    assert.equal(output.getContent(), 'foo', 'has a valid content');
  });

  test('Controller.exeute(): Outgoing Webhook', function (assert) {
    var controller = common.createController({text: 'foo'});
    var output = controller.execute();
    assert.ok(SlackBot.Obj.isGASObject(output, 'TextOutput'), 'returns a TextOutput object');
    assert.equal(output.getMimeType(), ContentService.MimeType.JSON, 'MimeType is JSON');
    assert.equal(output.getContent(), JSON.stringify({text: 'foo'}), 'has a valid content');
  });

  test('Controller.exeute(): Slash Commands /ping', function (assert) {
    var controller = common.createController({command: '/ping'});
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

  test('Controller.verifyToken()', function (assert) {
    var controller = common.createController();

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
