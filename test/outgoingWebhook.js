var assert = require('assert');

var common = require('./common');

describe('Outgoing Webhook', function testOutgoingWebhook() {
  it('outgoing webhook', function testOutgoingWebhookHandler() {
    return common.createApiOutgoingWebhook('foo').then(function testResponse(res) {
      assert(res.statusCode === 200);
      assert(/application\/json/.test(res.headers['content-type']));

      var output = JSON.parse(res.text);
      assert(output.text === 'foo');
    });
  });
});
