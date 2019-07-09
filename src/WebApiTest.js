TestRunner.functions.push(function (test, common) {
  function createWebApi() {
    return new WebApi(common.getProperty('SLACK_BOT_ACCESS_TOKEN'));
  }

  test('new WebApi()', function (assert) {
    var webApi = new WebApi('access token');
    assert.ok(webApi instanceof WebApi, 'creates WebApi object');
    assert.equal(webApi.token, 'access token', 'sets an access token');
  });

  test('WebApi.apiTest()', function (assert) {
    var webApi = createWebApi();

    var response = webApi.apiTest({foo: 'bar'});
    assert.ok(response.ok, 'successes api.test method');
    assert.equal(response.args.foo, 'bar', 'returns a passed parameter');

    response = webApi.apiTest({error: 'error message'});
    assert.notOk(response.ok, 'fails api.test method');
    assert.equal(response.error, 'error message', 'returns a passed error message');
  });

  test('WebApi.chatPostMessage()', function (assert) {
    var webApi = createWebApi();
    var channelId = common.getProperty('SLACK_CHANNEL_ID');

    var response = webApi.chatPostMessage(channelId, 'Test: WebApi.chatPostMessage()');
    assert.ok(response.ok, 'successes chat.postMessage method');
    assert.equal(response.channel, channelId, 'returns a channel id');
    assert.equal(response.message.text, 'Test: WebApi.chatPostMessage()', 'returns a text message');
  });
});

/* eslint func-names: ["error", "never"] */
