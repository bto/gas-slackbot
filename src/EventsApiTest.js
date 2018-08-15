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

  test('EventsApi.verify()', function (assert) {
    var api = createApi();

    assert.notOk(api.verify('token'), 'returns false for an invalid verification token');

    var token = common.getProperty('SLACK_VERIFICATION_TOKEN');
    assert.ok(api.verify(token), 'returns true for a valid verification token');
  });

  test('EventsApi._call()', function (assert) {
    var api = createApi();

    assert.throws(
      function () {
        api._call({type: 'foo'});
      },
      'throws an exception if an invalid event type was called'
    );

    var output = api._call({type: 'url_verification', challenge: 'challenge code'});
    assert.equal(typeof output, 'object', 'returns a ContentService object');
    assert.equal(output.getMimeType(), ContentService.MimeType.TEXT, 'MimeType is TEXT');
    assert.equal(output.getContent(), 'challenge code', 'has a valid content');
  });

  test('EventsApi._call_url_verification()', function (assert) {
    var api = createApi();
    var params = {challenge: 'challenge code'};
    assert.equal(api._call_url_verification(params), 'challenge code', 'returns a challenge code');
  });
});

/* eslint func-names: ["error", "never"] */
