testRunner.functions.push(function (test, common) {
  function createOutgoingWebhook(params) {
    return new OutgoingWebhook(common.createDI(params));
  }

  test('registerOutgoingWebhook()', function (assert) {
    var funcOrg = OutgoingWebhook.prototype.handler;
    var func = function () {};
    registerOutgoingWebhook(func);
    assert.equal(OutgoingWebhook.prototype.handler, func, 'register an outgoing webhook function');
    registerOutgoingWebhook(funcOrg);
  });

  test('new OutgoingWebhook()', function (assert) {
    var outgoingWebhook = new OutgoingWebhook(common.createDI());
    assert.ok(outgoingWebhook instanceof OutgoingWebhook, 'creates OutgoingWebhook object');

    assert.throws(
      function () {
        outgoingWebhook = new OutgoingWebhook();
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
