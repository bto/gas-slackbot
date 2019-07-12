var SLACK_BOT_ACCESS_TOKEN;
var SLACK_VERIFICATION_TOKEN;

function doPost(e) {
  var bot = new SlackBot.Controller(e);
  var properties = PropertiesService.getScriptProperties();

  if (SLACK_BOT_ACCESS_TOKEN) {
    bot.setBotAccessToken(SLACK_BOT_ACCESS_TOKEN);
  } else {
    bot.setBotAccessToken(properties.getProperty('SLACK_BOT_ACCESS_TOKEN'));
  }

  if (SLACK_VERIFICATION_TOKEN) {
    bot.setVerificationToken(SLACK_VERIFICATION_TOKEN);
  } else {
    bot.setVerificationToken(properties.getProperty('SLACK_VERIFICATION_TOKEN'));
  }

  return bot.execute();
}

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^doPost$" }] */
