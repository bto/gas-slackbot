var assert = require('assert');
var supertest = require('supertest');

var config = require('./config');

function createApi() {
  return supertest(config.url)
    .post('')
    .redirects(1)
    .set('Content-Type', 'application/json');
}

function createPostData(eventParams, params) {
  return Object.assign({
    'event': Object.assign({
      'type': 'app_mention',
      'channel': config.channelId
    }, eventParams ? eventParams : {}),
    'token': config.verificationToken,
    'type': 'event_callback'
  }, params ? params : {});
}

describe('Events API', function testEventsApi() {
  it('url verification', function testUrlVerification() {
    return createApi().send(createPostData({}, {
      'type': 'url_verification',
      'challenge': 'challenge code'
    })).then(function testResponse(res) {
      assert(res.statusCode === 200);
      assert(res.text === 'challenge code');
    });
  });

  it('app_mention event unknown command', function testAppMention() {
    return createApi().send(createPostData({
      'text': '<@Uxxx> foo'
    })).then(function testResponse(res) {
      assert(res.statusCode === 200);
      assert(res.text === 'そんなコマンドはないよ。');
    });
  });

  it('app_mention event help', function testAppMention() {
    return createApi().send(createPostData({
      'text': '<@Uxxx> help'
    })).then(function testResponse(res) {
      assert(res.statusCode === 200);
      assert(res.text === '吾輩はBotである。ヘルプはまだない。');
    });
  });

  it('app_mention event ping', function testAppMention() {
    return createApi().send(createPostData({
      'text': '<@Uxxx> ping'
    })).then(function testResponse(res) {
      assert(res.statusCode === 200);
      assert(res.text === 'PONG');
    });
  });
});
