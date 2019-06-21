var assert = require('power-assert');
var supertest = require('supertest');

var config = require('./config');

function createApi() {
  return supertest(config.url)
    .post('')
    .redirects(1)
    .set('Content-Type', 'application/json');
}

describe('slack Events API', function testSlackEventsApi() {
  it('url verification', function testUrlVerification() {
    return createApi().send({
      'token': config.verificationToken,
      'type': 'url_verification',
      'challenge': 'challenge code'
    }).then(function testResponse(res) {
      assert(res.statusCode === 200);
      assert(res.text === 'challenge code');
    });
  });

  it('app_mention event unknown command', function testAppMention() {
    return createApi().send({
      'token': config.verificationToken,
      'type': 'event_callback',
      'event': {
        'type': 'app_mention',
        'text': ''
      }
    }).then(function testResponse(res) {
      assert(res.statusCode === 200);
      assert(res.text === 'そんなコマンドはないよ。');
    });
  });

  it('app_mention event help', function testAppMention() {
    return createApi().send({
      'token': config.verificationToken,
      'type': 'event_callback',
      'event': {
        'type': 'app_mention',
        'text': '<@Uxxx> help'
      }
    }).then(function testResponse(res) {
      assert(res.statusCode === 200);
      assert(res.text === '吾輩はBotである。ヘルプはまだない。');
    });
  });

  it('app_mention event ping', function testAppMention() {
    return createApi().send({
      'token': config.verificationToken,
      'type': 'event_callback',
      'event': {
        'type': 'app_mention',
        'text': '<@Uxxx> ping'
      }
    }).then(function testResponse(res) {
      assert(res.statusCode === 200);
      assert(res.text === 'PONG');
    });
  });
});
