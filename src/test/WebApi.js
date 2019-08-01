testRunner.functions.push(function (test, common) {
  function createWebApi() {
    return new WebApi(common.getProperty('SLACK_BOT_ACCESS_TOKEN'));
  }

  test('new WebApi()', function (assert) {
    var webApi = new WebApi('access token');
    assert.ok(webApi instanceof WebApi, 'creates WebApi object');
    assert.equal(webApi.token, 'access token', 'sets an access token');
  });

  test('WebApi.call()', function (assert) {
    var webApi = createWebApi();

    assert.throws(
      function () {
        webApi.call('api.test', 'foo');
      },
      'throws an exception if an invalid HTTP method was passed'
    );

    var response = webApi.call('api.test', 'get');
    assert.deepEqual(
      response,
      {
        ok: true,
        args: {
          token: webApi.token
        }
      },
      'get api.test without paremeters'
    );

    response = webApi.call('api.test', 'get', {foo: 'bar'});
    assert.deepEqual(
      response,
      {
        ok: true,
        args: {
          foo: 'bar',
          token: webApi.token
        }
      },
      'get api.test with paremeters'
    );

    response = webApi.call('api.test', 'json');
    assert.deepEqual(
      response,
      {
        ok: true,
        args: {
          token: webApi.token
        }
      },
      'post json api.test without paremeters'
    );

    response = webApi.call('api.test', 'json', {foo: 'bar'});
    assert.deepEqual(
      response,
      {
        ok: true,
        args: {
          foo: 'bar',
          token: webApi.token
        }
      },
      'post json api.test with parameters'
    );

    response = webApi.call('api.test', 'post');
    assert.deepEqual(
      response,
      {
        ok: true,
        args: {
          token: webApi.token
        }
      },
      'post form api.test without paremeters'
    );

    response = webApi.call('api.test', 'post', {foo: 'bar'});
    assert.deepEqual(
      response,
      {
        ok: true,
        args: {
          foo: 'bar',
          token: webApi.token
        }
      },
      'post form api.test with parameters'
    );

    response = webApi.call('api.test', 'post', {error: 'error message'});
    assert.notOk(response, 'fails api.test with an error arugment');
    assert.equal(webApi.errorMessage, 'error message', 'set proper error message');
    assert.deepEqual(
      webApi.result,
      {
        ok: false,
        error: 'error message',
        args: {
          error: 'error message',
          token: webApi.token
        }
      },
      'set proper result'
    );

    webApi.token = null;
    response = webApi.call('api.test', 'get');
    assert.notOk(response, 'fails api.test without an authentication token');
    assert.equal(webApi.errorMessage, 'invalid_auth', 'set proper error message');
    assert.deepEqual(
      webApi.result,
      {
        ok: false,
        error: 'invalid_auth'
      },
      'set proper result'
    );
  });

  test('WebApi.call(): chat.postMessage', function (assert) {
    var webApi = createWebApi();
    var channelId = common.getProperty('SLACK_CHANNEL_ID');

    var response = webApi.call('chat.postMessage', 'post', {
      channel: channelId,
      text: 'chat.postMessage test'
    });
    assert.ok(response.ok, 'successes chat.postMessage method');
    assert.equal(response.channel, channelId, 'returns a channel id');
    assert.equal(response.message.text, 'chat.postMessage test', 'returns a text message');
  });

  test('WebApi.createApiUrl()', function (assert) {
    var webApi = createWebApi();

    var url = webApi.createApiUrl('apiMethod');
    assert.equal(url, 'https://slack.com/api/apiMethod', 'returns a valid api url');
  });

  test('WebApi.createFetchOptions()', function (assert) {
    var webApi = createWebApi();

    var options = webApi.createFetchOptions('get');
    assert.deepEqual(
      options,
      {
        headers: {
          Authorization: 'Bearer ' + webApi.token
        },
        method: 'get',
        muteHttpExceptions: true
      },
      'returns a valid options for GET'
    );

    options = webApi.createFetchOptions('json', {foo: 'bar'});
    assert.deepEqual(
      options,
      {
        contentType: 'application/json; charset=utf-8',
        headers: {
          Authorization: 'Bearer ' + webApi.token
        },
        method: 'post',
        muteHttpExceptions: true,
        payload: JSON.stringify({foo: 'bar'})
      },
      'returns a valid options for POST json'
    );

    options = webApi.createFetchOptions('post', {foo: 'bar'});
    assert.deepEqual(
      options,
      {
        headers: {
          Authorization: 'Bearer ' + webApi.token
        },
        method: 'post',
        muteHttpExceptions: true,
        payload: {foo: 'bar'}
      },
      'returns a valid options for POST form'
    );
  });

  test('WebApi.createRequestParams()', function (assert) {
    var webApi = createWebApi();

    var params = webApi.createRequestParams();
    assert.deepEqual(
      params,
      {
        token: webApi.token
      },
      'returns valid parameters without parameters'
    );

    params = webApi.createRequestParams({foo: 'bar'});
    assert.deepEqual(
      params,
      {
        foo: 'bar',
        token: webApi.token
      },
      'returns valid parameters'
    );
  });

  test('WebApi.createQueryString()', function (assert) {
    var webApi = createWebApi();

    var queryString = webApi.createQueryString({'foo': 'bar'});
    assert.equal(queryString, '?foo=bar', 'returns a valid query string');

    queryString = webApi.createQueryString({foo: 'bar', 'fo=o': 'ba&r'});
    assert.equal(queryString, '?foo=bar&fo%3Do=ba%26r', 'returns a valid query string');
  });
});

/* eslint func-names: ["error", "never"] */
