var assert = require('power-assert');
var supertest = require('supertest');

var url = 'https://script.google.com/a/uuum.jp/macros/s/AKfycbxqOVBusPqKvQY8i8xnOEOU0BBDjTYOM6VYzch9vw/exec';
var api = supertest(url);

describe('slack event api', function testSlackEventApi() {
  it('url verification', function testUrlVerification() {
    return api.post('')
      .redirects(1)
      .set('Content-Type', 'application/json')
      .send({
        'token': '9ufNZYQBibsMDlLMMlRuZot4',
        'type': 'url_verification',
        'challenge': 'challenge code'
      })
      .then(function testUrlVerificationResponse(res) {
        assert(res.statusCode === 200);
        assert(res.text === 'challenge code');
      });
  });
});
