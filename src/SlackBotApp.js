/**
 * Create a SlackBot object
 * @return {SlackBot} return a SlackBot Object
 */
function create() {
  return new SlackBot();
}

function command(commandName, func) {
  SlackBot.prototype.commands[commandName] = func;
}

var SlackBot = function SlackBot() {
};

SlackBot.prototype.commands = {};
SlackBot.prototype.username = 'gasbot';
SlackBot.prototype.defaultMessage = 'ごめんね。良くわからない。';

SlackBot.prototype.execute = function execute(event) {
  this.setRequestParams(event);
  this.verify();

  var params = this.request.parameter.text.split(/\s+/);
  if (this.commands.hasOwnProperty(params[1])) {
    return this.commands[params[1]](this);
  }

  this.send('ごめんね。良くわからない。');
  return this;
};

SlackBot.prototype.getDefaultMessage = function getDefaultMessage() {
  return this.defaultMessage;
};

SlackBot.prototype.getUsername = function getUsername() {
  return this.username;
};

SlackBot.prototype.send = function send(message) {
  this.slackApp.chatPostMessage(this.channelId, message, {username: this.username});
};

/**
 * Set an access token
 * @param {String} accessToken: bot user OAuth access token
 * @return {Object} return itself
 */
SlackBot.prototype.setAccessToken = function setAccessToken(accessToken) {
  this.accessToken = accessToken;
  this.slackApp = SlackApp.create(accessToken);
  return this;
};

/**
 * Set default message
 * @param {String} defaultMessage: default message
 * @return {Object} return itself
 */
SlackBot.prototype.setDefaultMessage = function setDefaultMessage(defaultMessage) {
  this.defaultMessage = defaultMessage;
  return this;
};

/**
 * Set request parameters
 * @param {Object} request: web app request parameters
 * @return {Object} return itself
 */
SlackBot.prototype.setRequestParams = function setRequestParams(request) {
  this.request = request;
  this.channelId = request.parameter.channel_id;

  return this;
};

/**
 * Set username
 * @param {String} username: bot user name
 * @return {Object} return itself
 */
SlackBot.prototype.setUsername = function setUsername(username) {
  this.username = username;
  return this;
};

/**
 * Set a verification token
 * @param {String} verificationToken: outgoing webhook's verification token
 * @return {Object} return itself
 */
SlackBot.prototype.setVerificationToken = function setVerificationToken(verificationToken) {
  this.verificationToken = verificationToken;
  return this;
};

/**
 * Verify if a token is valid
 * @return {boolean} return true or false
 */
SlackBot.prototype.verify = function verify() {
  if (this.request.parameter.token !== this.verificationToken) {
    throw new Error('invalid token.');
  }

  return true;
};

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^create|command$" }] */
