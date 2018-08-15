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
});

/* eslint func-names: ["error", "never"] */
