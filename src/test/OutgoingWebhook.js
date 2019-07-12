TestRunner.functions.push(function (test, common) {
  function createOutgoingWebhook(params) {
    return new SlackBot.OutgoingWebhook(common.createController(params));
  }

  test('registerOutgoingWebhook()', function (assert) {
    var funcOrg = SlackBot.OutgoingWebhook.prototype.handler;
    var func = function () {};
    SlackBot.registerOutgoingWebhook(func);
    assert.equal(SlackBot.OutgoingWebhook.prototype.handler, func, 'register an outgoing webhook function');
    SlackBot.registerOutgoingWebhook(funcOrg);
  });

  test('new OutgoingWebhook()', function (assert) {
    var outgoingWebhook = new SlackBot.OutgoingWebhook(common.createController());
    assert.ok(outgoingWebhook instanceof SlackBot.OutgoingWebhook, 'creates OutgoingWebhook object');

    assert.throws(
      function () {
        outgoingWebhook = new SlackBot.OutgoingWebhook(null);
      },
      'throws an exception if a controller object was not provided'
    );
  });

  test('OutgoingWebhook.execute()', function (assert) {
    var outgoingWebhook = createOutgoingWebhook({text: 'foo'});
    var output = outgoingWebhook.execute();
    assert.equal(output.text, 'foo', 'output has a valid text');
  });

  test('OutgoingWebhook.verifyToken()', function (assert) {
    var outgoingWebhook = createOutgoingWebhook();

    assert.notOk(outgoingWebhook.verifyToken('token'), 'returns false for an invalid verification token');

    var token = common.getProperty('SLACK_VERIFICATION_TOKEN');
    assert.ok(outgoingWebhook.verifyToken(token), 'returns true for a valid verification token');
  });
});

/* eslint func-names: ["error", "never"] */
