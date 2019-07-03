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
    var api = new EventsApi(createEvent());
    assert.ok(api instanceof EventsApi, 'creates EventsApi object');

    assert.throws(
      function () {
        api = new EventsApi(null);
      },
      'throws an exception if an event object was not provided'
    );
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

  test('EventsApi.verifyToken()', function (assert) {
    var api = createApi();

    assert.notOk(api.verifyToken('token'), 'returns false for an invalid verification token');

    var token = common.getProperty('SLACK_VERIFICATION_TOKEN');
    assert.ok(api.verifyToken(token), 'returns true for a valid verification token');
  });
});

/* eslint func-names: ["error", "never"] */
