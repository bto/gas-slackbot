TestRunner.functions.push(function (test, common) {
  function createApi(eventParams, params) {
    return new EventsApi(createBot(eventParams, params));
  }

  function createBot(eventParams, params) {
    var bot = new Bot(createEvent(eventParams, params));
    bot.setBotAccessToken(common.getProperty('SLACK_BOT_ACCESS_TOKEN'));
    bot.setVerificationToken(common.getProperty('SLACK_VERIFICATION_TOKEN'));
    return bot;
  }

  function createEvent(eventParams, params) {
    var body = Obj.merge({
      challenge: 'challenge code',
      event: Obj.merge({
        channel: common.getProperty('SLACK_CHANNEL_ID'),
        type: 'app_mention'
      }, eventParams ? eventParams : {}),
      token: common.getProperty('SLACK_VERIFICATION_TOKEN'),
      type: 'event_callback'
    }, params ? params : {});

    return {
      postData: {
        contents: JSON.stringify(body)
      }
    };
  }

  test('registerBotCommand()', function (assert) {
    var func = function () {};
    registerBotCommand('foo', func);
    assert.equal(EventsApi.prototype.botCommands.foo, func, 'register a command function');
  });

  test('registerEventHandler()', function (assert) {
    var func = function () {};
    registerEventHandler('foo', func);
    assert.equal(EventsApi.prototype.eventHandlers.foo[0], func, 'register a event function');
  });

  test('new EventsApi()', function (assert) {
    var api = new EventsApi(createBot());
    assert.ok(api instanceof EventsApi, 'creates EventsApi object');

    assert.throws(
      function () {
        api = new EventsApi(null);
      },
      'throws an exception if a bot object was not provided'
    );
  });

  test('EventsApi.callEventHandlers()', function (assert) {
    var api = createApi({type: 'foo_event'});
    var f1Called = 0;
    var f2Called = 0;

    var output = api.callEventHandlers();
    assert.equal(output, null, 'return null');
    assert.equal(f1Called, 0, 'first function was not called');
    assert.equal(f2Called, 0, 'second function was not called');

    registerEventHandler(
      'foo_event',
      function () {
        f1Called++;
      }
    );
    output = api.callEventHandlers();
    assert.equal(output, null, 'return null');
    assert.equal(f1Called, 1, 'first function was called');
    assert.equal(f2Called, 0, 'second function was not called');

    registerEventHandler(
      'foo_event',
      function () {
        f2Called++;
        return 'f2';
      }
    );
    output = api.callEventHandlers();
    assert.equal(output, 'f2', 'return a valid string');
    assert.equal(f1Called, 2, 'first function was called');
    assert.equal(f2Called, 1, 'second function was not called');
  });

  test('EventsApi.execute(): app_mention', function (assert) {
    var api = createApi({
      type: 'app_mention',
      text: ''
    });
    assert.equal(api.execute(), 'そんなコマンドはないよ。', 'has a valid content');
  });

  test('EventsApi.execute(): app_mention', function (assert) {
    var api = createApi({
      type: 'app_mention',
      text: '<@Uxxx> help'
    });
    assert.equal(api.execute(), '吾輩はBotである。ヘルプはまだない。', 'has a valid content');
  });

  test('EventsApi.execute(): app_mention', function (assert) {
    var api = createApi({
      type: 'app_mention',
      text: '<@Uxxx> ping'
    });
    assert.equal(api.execute(), 'PONG', 'has a valid content');
  });

  test('EventsApi.execute(): url_verification', function (assert) {
    var api = createApi({}, {challenge: 'foo', type: 'url_verification'});
    assert.equal(api.execute(), 'foo', 'has a valid content');
  });

  test('EventsApi.getCallbackType()', function (assert) {
    var api = createApi(null, {type: 'url_verification'});
    assert.equal(api.getCallbackType(), 'url_verification', 'returns url_verification');

    api = createApi(null, {type: 'event_callback'});
    assert.equal(api.getCallbackType(), 'event_callback', 'returns event_callback');
  });

  test('EventsApi.getCallbackType()', function (assert) {
    var api = createApi(null, {challenge: 'challenge code'});
    assert.equal(api.getChallengeCode(), 'challenge code', 'returns challenge code');
  });

  test('EventsApi.getEventType()', function (assert) {
    var api = createApi({type: 'foo_bar'});
    assert.equal(api.getEventType(), 'foo_bar', 'returns foo_bar');
  });

  test('EventsApi.verifyToken()', function (assert) {
    var api = createApi();

    assert.notOk(api.verifyToken('token'), 'returns false for an invalid verification token');

    var token = common.getProperty('SLACK_VERIFICATION_TOKEN');
    assert.ok(api.verifyToken(token), 'returns true for a valid verification token');
  });
});

/* eslint func-names: ["error", "never"] */
