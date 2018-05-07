var Slack = function Slack() {
  this.app = SlackApp.create(PropertiesService.getScriptProperties().getProperty('SLACK_ACCESS_TOKEN'));

  this.channelId = event.parameter.channel_id;
  this.username = 'gasbot';
};

Slack.prototype.send = function send(message) {
  this.app.chatPostMessage(this.channelId, message, {username: this.username});
};
