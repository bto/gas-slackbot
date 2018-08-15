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

    var params = api._createFetchParams({foo: 'bar'});
    assert.deepEqual(
      params,
      {
        foo: 'bar',
        token: api.token
      },
      'returns valid parameters'
    );
  });
});

/* eslint func-names: ["error", "never"] */
