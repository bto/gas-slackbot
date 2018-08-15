testRunner.functions.push(function (test, common) {
  function createApi() {
    return new WebApi(common.getProperty('SLACK_ACCESS_TOKEN'));
  }

  test('new WebApi()', function (assert) {
    var api = new WebApi('access token');
    assert.ok(api instanceof WebApi, 'creates WebApi object');
    assert.equal(api.token, 'access token', 'sets an access token');
  });

  test('WebApi._createApiUrl()', function (assert) {
    var api = createApi();

    var url = api._createApiUrl('apiMethod');
    assert.equal(url, 'https://slack.com/api/apiMethod', 'returns a valid api url');
  });

  test('WebApi._createFetchOptions()', function (assert) {
    var api = createApi();

    var options = api._createFetchOptions('get');
    assert.deepEqual(
      options,
      {
        headers: {
          Authorization: 'Bearer ' + api.token
        },
        method: 'get',
        muteHttpExceptions: true
      },
      'returns a valid options for GET'
    );

    options = api._createFetchOptions('post', {foo: 'bar'});
    assert.deepEqual(
      options,
      {
        headers: {
          Authorization: 'Bearer ' + api.token
        },
        method: 'post',
        muteHttpExceptions: true,
        payload: {foo: 'bar'}
      },
      'returns a valid options for POST form'
    );

    options = api._createFetchOptions('post', {foo: 'bar'}, true);
    assert.deepEqual(
      options,
      {
        contentType: 'application/json; charset=utf-8',
        headers: {
          Authorization: 'Bearer ' + api.token
        },
        method: 'post',
        muteHttpExceptions: true,
        payload: JSON.stringify({foo: 'bar'})
      },
      'returns a valid options for POST json'
    );
  });

  test('WebApi._createFetchParams()', function (assert) {
    var api = createApi();

    var params = api._createFetchParams();
    assert.deepEqual(
      params,
      {
        token: api.token
      },
      'returns valid parameters without parameters'
    );

    params = api._createFetchParams({foo: 'bar'});
    assert.deepEqual(
      params,
      {
        foo: 'bar',
        token: api.token
      },
      'returns valid parameters'
    );
  });

  test('WebApi._fetch()', function (assert) {
    var api = createApi();

    assert.throws(
      function () {
        api._fetch('api.test', 'get');
      },
      'throws an exception if HTTP GET method was passed'
    );

    assert.throws(
      function () {
        api._fetch('api.test', 'foo');
      },
      'throws an exception if an invalid HTTP method was passed'
    );

    var response = api._fetch('api.test', 'post');
    assert.deepEqual(
      response,
      {
        ok: true,
        args: {
          token: api.token
        }
      },
      'successes api.test without paremeters'
    );

    response = api._fetch('api.test', 'post', {foo: 'bar'});
    assert.deepEqual(
      response,
      {
        ok: true,
        args: {
          foo: 'bar',
          token: api.token
        }
      },
      'successes api.test'
    );
  });

  test('WebApi._fetchUrl()', function (assert) {
    var api = createApi();
    var url = api._createApiUrl('api.test');
    var params = api._createFetchParams({foo: 'bar'});

    var options = api._createFetchOptions('post', params);
    var response = api._fetchUrl(url, options);
    assert.deepEqual(
      response,
      {
        ok: true,
        args: {
          foo: 'bar',
          token: api.token
        }
      },
      'successes api.test by POST form'
    );

    options = api._createFetchOptions('post', params, true);
    response = api._fetchUrl(url, options);
    assert.deepEqual(
      response,
      {
        ok: true,
        args: {
          foo: 'bar',
          token: api.token
        }
      },
      'successes api.test by POST json'
    );

    params = api._createFetchParams({error: 'error message'});
    options = api._createFetchOptions('post', params);
    response = api._fetchUrl(url, options);
    assert.deepEqual(
      response,
      {
        ok: false,
        error: 'error message',
        args: {
          error: 'error message',
          token: api.token
        }
      },
      'fails api.test with an error arugment'
    );

    api.token = null;
    params = api._createFetchParams({foo: 'bar'});
    options = api._createFetchOptions('post', params);
    response = api._fetchUrl(url, options);
    assert.deepEqual(
      response,
      {
        ok: false,
        error: 'invalid_auth'
      },
      'fails api.test with an error arugment'
    );
  });
});

/* eslint func-names: ["error", "never"] */
