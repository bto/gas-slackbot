testRunner.functions.push(function (test, common) {
  function createObj() {
    return new BotApp(createEvent());
  }

  function createEvent(eventParams, params) {
    var body = params ? params : {};
    body.event = eventParams ? eventParams : {};
    body.token = common.getProperty('SLACK_VERIFICATION_TOKEN');

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

  test('BotApp.execute()', function () {
    var bot = createObj();
    bot.execute();
  });
});

/* eslint func-names: ["error", "never"] */
