TestRunner.functions.push(function (test, common) {
  function createEventsApi(params, eventParams) {
    return new SlackBot.EventsApi(common.createController(params, eventParams));
  }

  test('registerBotCommand()', function (assert) {
    var func = function () {};
    registerBotCommand('foo', func);
    assert.equal(SlackBot.EventsApi.prototype.commands.foo, func, 'register a command function');
  });

  test('registerEvent()', function (assert) {
    var func = function () {};
    registerEvent('foo', func);
    assert.equal(SlackBot.EventsApi.prototype.handlers.foo[0], func, 'register a event function');
  });

  test('new EventsApi()', function (assert) {
    var eventsApi = new SlackBot.EventsApi(common.createController());
    assert.ok(eventsApi instanceof SlackBot.EventsApi, 'creates EventsApi object');

    assert.throws(
      function () {
        eventsApi = new SlackBot.EventsApi(null);
      },
      'throws an exception if a controller object was not provided'
    );
  });

  test('EventsApi.callEventHandlers()', function (assert) {
    var eventsApi = createEventsApi(null, {type: 'foo_event'});
    var f1Called = 0;
    var f2Called = 0;

    var output = eventsApi.callEventHandlers();
    assert.equal(output, null, 'return null');
    assert.equal(f1Called, 0, 'first function was not called');
    assert.equal(f2Called, 0, 'second function was not called');

    registerEvent(
      'foo_event',
      function () {
        f1Called++;
      }
    );
    output = eventsApi.callEventHandlers();
    assert.equal(output, null, 'return null');
    assert.equal(f1Called, 1, 'first function was called');
    assert.equal(f2Called, 0, 'second function was not called');

    registerEvent(
      'foo_event',
      function () {
        f2Called++;
        return 'f2';
      }
    );
    output = eventsApi.callEventHandlers();
    assert.equal(output, 'f2', 'return a valid string');
    assert.equal(f1Called, 2, 'first function was called');
    assert.equal(f2Called, 1, 'second function was not called');
  });

  test('EventsApi.execute(): app_mention', function (assert) {
    var eventsApi = createEventsApi(null, {
      type: 'app_mention',
      text: ''
    });
    assert.equal(eventsApi.execute(), 'そんなコマンドはないよ。', 'has a valid content');
  });

  test('EventsApi.execute(): app_mention', function (assert) {
    var eventsApi = createEventsApi(null, {
      type: 'app_mention',
      text: '<@Uxxx> help'
    });
    assert.equal(eventsApi.execute(), '吾輩はBotである。ヘルプはまだない。', 'has a valid content');
  });

  test('EventsApi.execute(): app_mention', function (assert) {
    var eventsApi = createEventsApi(null, {
      type: 'app_mention',
      text: '<@Uxxx> ping'
    });
    assert.equal(eventsApi.execute(), 'PONG', 'has a valid content');
  });

  test('EventsApi.execute(): url_verification', function (assert) {
    var eventsApi = createEventsApi({challenge: 'foo', type: 'url_verification'});
    assert.equal(eventsApi.execute(), 'foo', 'has a valid content');
  });

  test('EventsApi.verifyToken()', function (assert) {
    var eventsApi = createEventsApi();

    assert.notOk(eventsApi.verifyToken('token'), 'returns false for an invalid verification token');

    var token = common.getProperty('SLACK_VERIFICATION_TOKEN');
    assert.ok(eventsApi.verifyToken(token), 'returns true for a valid verification token');
  });
});

/* eslint func-names: ["error", "never"] */
