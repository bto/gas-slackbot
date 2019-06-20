testRunner.functions.push(function (test, common) {
  function createObj(eventParams, params) {
    var botApp = new BotApp(createEvent(eventParams, params));
    botApp.setVerificationToken(common.getProperty('SLACK_VERIFICATION_TOKEN'));
    return botApp;
  }

  function createEvent(eventParams, params) {
    var body = Obj.merge({
      event: eventParams ? eventParams : {},
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

  test('registerCommand()', function (assert) {
    var func = function () {};
    registerCommand('foo', func);
    assert.equal(BotApp.prototype.commands.foo, func, 'register a command function');
  });

  test('new BotApp()', function (assert) {
    var botApp = createObj();
    assert.ok(botApp instanceof BotApp, 'creates BotApp object');
  });

  test('BotApp.execute()', function (assert) {
    var botApp = createObj({}, {challenge: 'foo', type: 'url_verification'});
    var output = botApp.execute();
    assert.ok(Obj.isGASObject(output, 'TextOutput'), 'returns a TextOutput object');
    assert.equal(output.getMimeType(), ContentService.MimeType.TEXT, 'MimeType is TEXT');
    assert.equal(output.getContent(), 'foo', 'has a valid content');
  });
});

/* eslint func-names: ["error", "never"] */
