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
      assert(res.text === 'PONG');
    });
  });
});
