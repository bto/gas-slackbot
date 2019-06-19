testRunner.functions.push(function (test, common) {
  function createApi(params) {
    return new EventsApi(createEvent(params));
  }

  function createEvent(params) {
    var body = params ? params : {};
    body.token = common.getProperty('SLACK_VERIFICATION_TOKEN');

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

  test('EventsApi.callEventCallback()', function (assert) {
    var api = createApi();
    var f1Called = 0;
    var f2Called = 0;
    var params = {event: {type: 'app_mention'}};

    var obj = api.callEventCallback(params);
    assert.equal(obj, null, 'return null');
    assert.equal(f1Called, 0, 'first function was not called');
    assert.equal(f2Called, 0, 'second function was not called');

    api.registerHandler(
      'app_mention',
      function () {
        f1Called++;
      }
    );
    obj = api.callEventCallback(params);
    assert.equal(obj, null, 'return null');
    assert.equal(f1Called, 1, 'first function was called');
    assert.equal(f2Called, 0, 'second function was not called');

    api.registerHandler(
      'app_mention',
      function () {
        f2Called++;
        return 'f2';
      }
    );
    obj = api.callEventCallback(params);
    assert.equal(typeof obj, 'object', 'returns a ContentService object');
    assert.equal(obj.getMimeType(), ContentService.MimeType.TEXT, 'MimeType is TEXT');
    assert.equal(obj.getContent(), 'f2', 'has a valid content');
    assert.equal(f1Called, 2, 'first function was called');
    assert.equal(f2Called, 1, 'second function was not called');
  });

  test('EventsApi.callUrlVerification()', function (assert) {
    var api = createApi();
    var output = api.callUrlVerification({challenge: 'challenge code'});
    assert.equal(typeof output, 'object', 'returns a ContentService object');
    assert.equal(output.getMimeType(), ContentService.MimeType.TEXT, 'MimeType is TEXT');
    assert.equal(output.getContent(), 'challenge code', 'has a valid content');
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

  test('EventsApi.verify()', function (assert) {
    var api = createApi();

    assert.notOk(api.verify('token'), 'returns false for an invalid verification token');

    var token = common.getProperty('SLACK_VERIFICATION_TOKEN');
    api.setVerificationToken(token);
    assert.ok(api.verify(), 'returns true for a valid verification token');
  });
});

/* eslint func-names: ["error", "never"] */
