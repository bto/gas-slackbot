TestRunner.functions.push(function (test, common) {
  function createApi(params) {
    return new EventsApi(createEvent(params));
  }

  function createEvent(params) {
    var body = Obj.merge({
      challenge: 'challenge code',
      event: {
        type: 'app_mention'
      },
      token: common.getProperty('SLACK_VERIFICATION_TOKEN'),
      type: 'event_callback'
    }, params ? params : {});

    return {
      postData: {
        contents: JSON.stringify(body)
      }
    };
  }

  test('new EventsApi()', function (assert) {
    var event = createEvent();
    var api = new EventsApi(event);
    assert.ok(api instanceof EventsApi, 'creates EventsApi object');
    assert.deepEqual(event, api.getEvent(), 'set an event object');
  });

  test('EventsApi event object', function (assert) {
    var api = createApi();

    var event = createEvent();
    var obj = api.setEvent(event);
    assert.equal(api, obj, 'returns itself');
    assert.deepEqual(event, api.getEvent(), 'set an event object');
  });

  test('EventsApi verification token', function (assert) {
    var api = createApi();

    var obj = api.setVerificationToken('verification token');
    assert.equal(api, obj, 'returns itself');
    assert.equal('verification token', api.getVerificationToken(), 'set a verification token');
  });

  test('EventsApi.getCallbackType()', function (assert) {
    var api = createApi({type: 'url_verification'});
    assert.equal(api.getCallbackType(), 'url_verification', 'returns url_verification');

    api = createApi({type: 'event_callback'});
    assert.equal(api.getCallbackType(), 'event_callback', 'returns event_callback');
  });

  test('EventsApi.getCallbackType()', function (assert) {
    var api = createApi({challenge: 'challenge code'});
    assert.equal(api.getChallengeCode(), 'challenge code', 'returns challenge code');
  });

  test('EventsApi.getEventType()', function (assert) {
    var api = createApi({event: {type: 'app_mention'}});
    assert.equal(api.getEventType(), 'app_mention', 'returns app_mention');

    api = createApi({type: 'event_callback'});
    assert.equal(api.getCallbackType(), 'event_callback', 'returns event_callback');
  });

  test('EventsApi.getParam()', function (assert) {
    var api = createApi();

    var token = api.getParam('token');
    assert.equal(token, common.getProperty('SLACK_VERIFICATION_TOKEN'), 'returns a valid parameter');

    assert.throws(
      function () {
        api.setEvent(null);
        api.getParam('foo');
      },
      'throws an exception if an event object was not provided'
    );
  });

  test('EventsApi.getParams()', function (assert) {
    var api = createApi();

    assert.equal(typeof api.getParams(), 'object', 'returns parameters');

    assert.throws(
      function () {
        api.setEvent(null);
        api.getParams();
      },
      'throws an exception if an event object was not provided'
    );
  });

  test('EventsApi.registerHandler()', function (assert) {
    var api = createApi();

    assert.deepEqual(api.handlers, {}, 'no handler was registered first');

    api.registerHandler('app_mention', function () {});
    var handlers = api.handlers.app_mention;
    assert.equal(handlers.length, 1, 'one handler was registered');
    assert.equal(typeof handlers[0], 'function', 'registered handler was a function');

    api.registerHandler('app_mention', function () {});
    handlers = api.handlers.app_mention;
    assert.equal(handlers.length, 2, 'two handlers was registered');
    assert.equal(typeof handlers[0], 'function', 'first handler was a function');
    assert.equal(typeof handlers[1], 'function', 'second handler was a function');
  });

  test('EventsApi.verifyToken()', function (assert) {
    var api = createApi();

    assert.notOk(api.verifyToken('token'), 'returns false for an invalid verification token');

    var token = common.getProperty('SLACK_VERIFICATION_TOKEN');
    api.setVerificationToken(token);
    assert.ok(api.verifyToken(), 'returns true for a valid verification token');
  });
});

/* eslint func-names: ["error", "never"] */
