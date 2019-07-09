var supertest = require('supertest');

var config = require('./config');

function createApi() {
  return supertest(config.url)
    .post('')
    .redirects(1);
}

function createApiBotCommand(command) {
  return createApiEventsApi({}, {
    text: '<@Uxxx> ' + command
  });
}

function createApiEventsApi(params, eventParams) {
  return createApi()
    .set('Content-Type', 'application/json')
    .send(createPostData(params, eventParams));
}

function createApiSlashCommand(command) {
  return createApi()
    .type('form')
    .field('token', config.verificationToken)
    .field('command', '/' + command);
}

function createPostData(params, eventParams) {
  return Object.assign({
    'event': Object.assign({
      'type': 'app_mention',
      'channel': config.channelId
    }, eventParams ? eventParams : {}),
    'token': config.verificationToken,
    'type': 'event_callback'
  }, params ? params : {});
}

module.exports = {
  createApi: createApi,
  createApiBotCommand: createApiBotCommand,
  createApiEventsApi: createApiEventsApi,
  createApiSlashCommand: createApiSlashCommand,
  createPostData: createPostData
};
