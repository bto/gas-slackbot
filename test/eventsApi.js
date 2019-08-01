var assert = require('assert');

var common = require('./common');

describe('Events API', function testEventsApi() {
  it('url verification', function testUrlVerification() {
    return common.createApiEventsApi({
      'type': 'url_verification',
      'challenge': 'challenge code'
    }).then(function testResponse(res) {
      assert(res.statusCode === 200);
      assert(/text\/plain/.test(res.headers['content-type']));
      assert(res.text === 'challenge code');
    });
  });

  it('bot command unknown command', function testBotCommand() {
    return common.createApiBotCommand('foo').then(function testResponse(res) {
      assert(res.statusCode === 200);
      assert(/text\/plain/.test(res.headers['content-type']));
      assert(res.text === '');
    });
  });

  it('bot command nop', function testBotCommand() {
    return common.createApiBotCommand('nop').then(function testResponse(res) {
      assert(res.statusCode === 200);
      assert(/text\/plain/.test(res.headers['content-type']));
      assert(res.text === '');
    });
  });

  it('bot command help', function testBotCommand() {
    return common.createApiBotCommand('help').then(function testResponse(res) {
      assert(res.statusCode === 200);
      assert(/text\/plain/.test(res.headers['content-type']));
      assert(res.text === '');
    });
  });

  it('bot command ping', function testBotCommand() {
    return common.createApiBotCommand('ping').then(function testResponse(res) {
      assert(res.statusCode === 200);
      assert(/text\/plain/.test(res.headers['content-type']));
      assert(res.text === '');
    });
  });
});
