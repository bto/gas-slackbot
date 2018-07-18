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

/**
 * Get an access token
 * @return {String} return an access token
 */
SlackBot.prototype.getAccessToken = function getAccessToken() {
  return this.accessToken;
};

/**
 * Get a default message
 * @return {String} return a default message
 */
SlackBot.prototype.getDefaultMessage = function getDefaultMessage() {
  return this.defaultMessage;
};

/**
 * Get a request object
 * @return {Object} return a request object
 */
SlackBot.prototype.getRequest = function getRequest() {
  return this.request;
};

/**
 * Get a username
 * @return {String} return a username
 */
SlackBot.prototype.getUsername = function getUsername() {
  return this.username;
};

/**
 * Get a verification token
 * @return {String} return a verification token
 */
SlackBot.prototype.getVerificationToken = function getVerificationToken() {
  return this.verificationToken;
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
 * Set a default message
 * @param {String} defaultMessage: default message
 * @return {Object} return itself
 */
SlackBot.prototype.setDefaultMessage = function setDefaultMessage(defaultMessage) {
  this.defaultMessage = defaultMessage;
  return this;
};

/**
 * Set a request object
 * @param {Object} request object
 * @return {Object} return itself
 */
SlackBot.prototype.setRequest = function setRequest(request) {
  this.request = request;
  this.channelId = request.parameter.channel_id;

  return this;
};

/**
 * Set an username
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
