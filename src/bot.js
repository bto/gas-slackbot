var verifyToken = 'W0R0DJRWSURrEmDZF8bU1PZ2';
var slack;

function doPost(e) {
  if (e.parameter.token !== verifyToken) {
    throw new Error('invalid token.');
  }

  slack = new Slack();
  slack.channelId = e.parameter.channel_id;
  slack.username = 'gasbot';

  var params = e.parameter.text.split(/\s+/);
  switch (params[1]) {
  case 'tenki':
    slack.send('tenki');
    return;

  default:
    slack.send('ごめんね。良くわからない。');
    return;
  }
}

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^doPost$" }] */
