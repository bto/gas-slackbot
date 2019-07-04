function doPost(e) {
  var bot = new Bot(e);

  var properties = PropertiesService.getScriptProperties();
  bot.setBotAccessToken(properties.getProperty('SLACK_BOT_ACCESS_TOKEN'));
  bot.setVerificationToken(properties.getProperty('SLACK_VERIFICATION_TOKEN'));

  return bot.execute();
}

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^doPost$" }] */
