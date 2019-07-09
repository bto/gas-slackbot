TestRunner.functions.push(function (test, common) {
  function createWebApiFetch() {
    return new WebApiFetch(common.getProperty('SLACK_BOT_ACCESS_TOKEN'));
  }

  test('new WebApiFetch()', function (assert) {
    var webApiFetch = new WebApiFetch('access token');
    assert.ok(webApiFetch instanceof WebApiFetch, 'creates WebApiFetch object');
    assert.equal(webApiFetch.token, 'access token', 'sets an access token');
  });

  test('WebApiFetch.createApiUrl()', function (assert) {
    var webApiFetch = createWebApiFetch();

    var url = webApiFetch.createApiUrl('apiMethod');
    assert.equal(url, 'https://slack.com/api/apiMethod', 'returns a valid api url');
  });

  test('WebApiFetch.createFetchOptions()', function (assert) {
    var webApiFetch = createWebApiFetch();

    var options = webApiFetch.createFetchOptions('get');
    assert.deepEqual(
      options,
      {
        headers: {
          Authorization: 'Bearer ' + webApiFetch.token
        },
        method: 'get',
        muteHttpExceptions: true
      },
      'returns a valid options for GET'
    );

    options = webApiFetch.createFetchOptions('json', {foo: 'bar'});
    assert.deepEqual(
      options,
      {
        contentType: 'application/json; charset=utf-8',
        headers: {
          Authorization: 'Bearer ' + webApiFetch.token
        },
        method: 'post',
        muteHttpExceptions: true,
        payload: JSON.stringify({foo: 'bar'})
      },
      'returns a valid options for POST json'
    );

    options = webApiFetch.createFetchOptions('post', {foo: 'bar'});
    assert.deepEqual(
      options,
      {
        headers: {
          Authorization: 'Bearer ' + webApiFetch.token
        },
        method: 'post',
        muteHttpExceptions: true,
        payload: {foo: 'bar'}
      },
      'returns a valid options for POST form'
    );
  });

  test('WebApiFetch.createRequestParams()', function (assert) {
    var webApiFetch = createWebApiFetch();

    var params = webApiFetch.createRequestParams();
    assert.deepEqual(
      params,
      {
        token: webApiFetch.token
      },
      'returns valid parameters without parameters'
    );

    params = webApiFetch.createRequestParams({foo: 'bar'});
    assert.deepEqual(
      params,
      {
        foo: 'bar',
        token: webApiFetch.token
      },
      'returns valid parameters'
    );
  });

  test('WebApiFetch.createQueryString()', function (assert) {
    var webApiFetch = createWebApiFetch();

    var queryString = webApiFetch.createQueryString({'foo': 'bar'});
    assert.equal(queryString, '?foo=bar', 'returns a valid query string');

    queryString = webApiFetch.createQueryString({foo: 'bar', 'fo=o': 'ba&r'});
    assert.equal(queryString, '?foo=bar&fo%3Do=ba%26r', 'returns a valid query string');
  });

  test('WebApiFetch.fetch()', function (assert) {
    var webApiFetch = createWebApiFetch();

    assert.throws(
      function () {
        webApiFetch.fetch('api.test', 'foo');
      },
      'throws an exception if an invalid HTTP method was passed'
    );

    var response = webApiFetch.fetch('api.test', 'get');
    assert.deepEqual(
      response,
      {
        ok: true,
        args: {
          token: webApiFetch.token
        }
      },
      'get api.test without paremeters'
    );

    response = webApiFetch.fetch('api.test', 'get', {foo: 'bar'});
    assert.deepEqual(
      response,
      {
        ok: true,
        args: {
          foo: 'bar',
          token: webApiFetch.token
        }
      },
      'get api.test with paremeters'
    );

    response = webApiFetch.fetch('api.test', 'json');
    assert.deepEqual(
      response,
      {
        ok: true,
        args: {
          token: webApiFetch.token
        }
      },
      'post json api.test without paremeters'
    );

    response = webApiFetch.fetch('api.test', 'json', {foo: 'bar'});
    assert.deepEqual(
      response,
      {
        ok: true,
        args: {
          foo: 'bar',
          token: webApiFetch.token
        }
      },
      'post json api.test with parameters'
    );

    response = webApiFetch.fetch('api.test', 'post');
    assert.deepEqual(
      response,
      {
        ok: true,
        args: {
          token: webApiFetch.token
        }
      },
      'post form api.test without paremeters'
    );

    response = webApiFetch.fetch('api.test', 'post', {foo: 'bar'});
    assert.deepEqual(
      response,
      {
        ok: true,
        args: {
          foo: 'bar',
          token: webApiFetch.token
        }
      },
      'post form api.test with parameters'
    );

    response = webApiFetch.fetch('api.test', 'post', {error: 'error message'});
    assert.deepEqual(
      response,
      {
        ok: false,
        error: 'error message',
        args: {
          error: 'error message',
          token: webApiFetch.token
        }
      },
      'fails api.test with an error arugment'
    );

    webApiFetch.token = null;
    response = webApiFetch.fetch('api.test', 'get');
    assert.deepEqual(
      response,
      {
        ok: false,
        error: 'invalid_auth'
      },
      'fails api.test without an authentication token'
    );
  });

  test('WebApiFetch.fetch(): chat.postMessage', function (assert) {
    var webApiFetch = createWebApiFetch();
    var channelId = common.getProperty('SLACK_CHANNEL_ID');

    var response = webApiFetch.fetch('chat.postMessage', 'post', {
      channel: channelId,
      text: 'chat.postMessage test'
    });
    assert.ok(response.ok, 'successes chat.postMessage method');
    assert.equal(response.channel, channelId, 'returns a channel id');
    assert.equal(response.message.text, 'chat.postMessage test', 'returns a text message');
  });
});

/* eslint func-names: ["error", "never"] */
