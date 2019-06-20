function doPost(e) {
  var botApp = new BotApp(e);

  var properties = PropertiesService.getScriptProperties();
  botApp.setVerificationToken(properties.getProperty('SLACK_VERIFICATION_TOKEN'));

  return botApp.execute();
}

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^doPost$" }] */
