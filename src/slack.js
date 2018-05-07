var Slack = function Slack() {
  var properties = PropertiesService.getScriptProperties();
  var token = properties.getProperty('SLACK_ACCESS_TOKEN');
  this.app = SlackApp.create(token);
};

Slack.prototype.send = function send(message) {
  this.app.chatPostMessage(this.channelId, message, {username: this.username});
};
