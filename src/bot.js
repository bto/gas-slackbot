var token = 'xoxb-359217879315-VI5wv2OWzP7Jng0xIslDuOOe';
var slackApp = SlackApp.create(token);
var verifyToken = 'W0R0DJRWSURrEmDZF8bU1PZ2';

function doPost(e) {
  if (e.parameter.token !== verifyToken) {
    throw new Error('invalid token.');
  }

  slackApp.chatPostMessage(e.parameter.channel_id, 'Hi ' + e.parameter.user_name, {
    username: 'gasbot'
  });

  return 'test';
}

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^doPost$" }] */
