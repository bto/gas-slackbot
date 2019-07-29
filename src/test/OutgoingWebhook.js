testRunner.functions.push(function (test, common) {
  function createOutgoingWebhook(params) {
    return new SlackBot.OutgoingWebhook(common.createDI(params));
  }

  test('registerOutgoingWebhook()', function (assert) {
    var funcOrg = SlackBot.OutgoingWebhook.prototype.handler;
    var func = function () {};
    SlackBot.registerOutgoingWebhook(func);
    assert.equal(SlackBot.OutgoingWebhook.prototype.handler, func, 'register an outgoing webhook function');
    SlackBot.registerOutgoingWebhook(funcOrg);
  });

  test('new OutgoingWebhook()', function (assert) {
    var outgoingWebhook = new SlackBot.OutgoingWebhook(common.createDI());
    assert.ok(outgoingWebhook instanceof SlackBot.OutgoingWebhook, 'creates OutgoingWebhook object');

    assert.throws(
      function () {
        outgoingWebhook = new SlackBot.OutgoingWebhook();
      },
      'throws an exception if a DI object was not provided'
    );
  });

  test('OutgoingWebhook.execute()', function (assert) {
    var outgoingWebhook = createOutgoingWebhook({text: 'foo'});
    var output = outgoingWebhook.execute();
    assert.equal(output.text, 'foo', 'output has a valid text');
  });
});

/* eslint func-names: ["error", "never"] */
