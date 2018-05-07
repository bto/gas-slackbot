function doPost(e) {
  gasbot.event = e;

  if (e.parameter.token !== PropertiesService.getScriptProperties().getProperty('SLACK_VERIFY_TOKEN')) {
    throw new Error('invalid token.');
  }

  var params = e.parameter.text.split(/\s+/);
  switch (params[1]) {
  case 'tenki':
    (new PluginTenki()).exec();
    return;

  default:
    (new Slack()).send('ごめんね。良くわからない。');
    return;
  }
}

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^doPost$" }] */
