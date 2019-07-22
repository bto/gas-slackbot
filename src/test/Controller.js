testRunner.functions.push(function (test, common) {
  test('new Controller()', function (assert) {
    var controller = common.createController();
    assert.ok(controller instanceof SlackBot.Controller, 'creates Controller object');
  });

  test('Controller bot access token', function (assert) {
    var controller = common.createController();

    var obj = controller.setBotAccessToken('bot access token');
    assert.equal(controller, obj, 'returns itself');
    assert.equal('bot access token', controller.getBotAccessToken(), 'set a bot access token');
  });

  test('Controller verification token', function (assert) {
    var controller = common.createController();

    var obj = controller.setVerificationToken('verification token');
    assert.equal(controller, obj, 'returns itself');
    assert.equal('verification token', controller.getVerificationToken(), 'set a verification token');
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
