var assert = require('assert');
var supertest = require('supertest');

var config = require('./config');

function createApi() {
  return supertest(config.url)
    .post('')
    .redirects(1)
    .type('form')
    .field('token', config.verificationToken);
}

describe('Slash Commands', function testSlashCommands() {
  it('/ping command', function testPing() {
    return createApi().field('command', '/ping').then(function testResponse(res) {
      assert(res.statusCode === 200);
      assert(/application\/json/.test(res.headers['content-type']));

      var output = JSON.parse(res.text);
      assert(output.response_type === 'in_channel');
      assert(output.text === 'PONG');
    });
  });
});
