var SLACK_BOT_ACCESS_TOKEN;
var SLACK_CHANNEL_ID;
var SLACK_VERIFICATION_TOKEN;

function doPost(e) {
  var properties = PropertiesService.getScriptProperties();

  var config = {
    botAccessToken: properties.getProperty('SLACK_BOT_ACCESS_TOKEN'),
    channelId: properties.getProperty('SLACK_CHANNEL_ID'),
    verificationToken: properties.getProperty('SLACK_VERIFICATION_TOKEN')
  };
  if (SLACK_BOT_ACCESS_TOKEN) {
    config.botAccessToken = SLACK_BOT_ACCESS_TOKEN;
  }
  if (SLACK_CHANNEL_ID) {
    config.channelId = SLACK_CHANNEL_ID;
  }
  if (SLACK_VERIFICATION_TOKEN) {
    config.verificationToken = SLACK_VERIFICATION_TOKEN;
  }

  if (typeof SlackBot === 'undefined') {
    var SlackBot = {
      Controller: Controller
    };
  }
  return (new SlackBot.Controller(e, config)).execute();
}

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^doPost$" }] */
