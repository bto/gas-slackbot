function doPost(e) {
  var controller = new SlackBot.Controller(e);

  var properties = PropertiesService.getScriptProperties();
  controller.setBotAccessToken(properties.getProperty('SLACK_BOT_ACCESS_TOKEN'));
  controller.setVerificationToken(properties.getProperty('SLACK_VERIFICATION_TOKEN'));

  return controller.execute();
}

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^doPost$" }] */
