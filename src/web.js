function doPost(e) {
  var botApp = new BotApp(e);

  var properties = PropertiesService.getScriptProperties();
  botApp.setBotAccessToken(properties.getProperty('SLACK_BOT_ACCESS_TOKEN'));
  botApp.setVerificationToken(properties.getProperty('SLACK_VERIFICATION_TOKEN'));

  return botApp.execute();
}

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^doPost$" }] */
