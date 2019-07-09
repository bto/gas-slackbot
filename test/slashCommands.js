var assert = require('assert');

var common = require('./common');

describe('Slash Commands', function testSlashCommands() {
  it('slash command ping', function testSLashCommand() {
    return common.createApiSlashCommand('ping').then(function testResponse(res) {
      assert(res.statusCode === 200);
      assert(/application\/json/.test(res.headers['content-type']));

      var output = JSON.parse(res.text);
      assert(output.response_type === 'in_channel');
      assert(output.text === 'PONG');
    });
  });
});
