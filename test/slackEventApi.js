var assert = require('power-assert');
var supertest = require('supertest');

var config = require('./config');

var api = supertest(config.url)
  .post('')
  .redirects(1)
  .set('Content-Type', 'application/json');

describe('slack event api', function testSlackEventApi() {
  it('url verification', function testUrlVerification() {
    return api.send({
      'token': config.verificationToken,
      'type': 'url_verification',
      'challenge': 'challenge code'
    }).then(function testUrlVerificationResponse(res) {
      assert(res.statusCode === 200);
      assert(res.text === 'challenge code');
    });
  });
});
