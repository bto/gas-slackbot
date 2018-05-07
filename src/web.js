function doPost(e) {
  gasbot.event = e;

  if (e.parameter.token !== PropertiesService.getScriptProperties().getProperty('SLACK_VERIFY_TOKEN')) {
    throw new Error('invalid token.');
  }

  var params = e.parameter.text.split(/\s+/);
  if (gasbot.plugins.hasOwnProperty(params[1])) {
    (new gasbot.plugins[params[1]]()).exec(params.slice(2));
  } else {
    (new Slack()).send('ごめんね。良くわからない。');
  }
}

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^doPost$" }] */
