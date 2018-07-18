/**
 * Register a SlackBot command
 * @param {String} commandName: a command name
 * @param {Object} func: a function object to process a command
 * @return {null} return nothing
 */
function command(commandName, func) {
  SlackBot.prototype.commands[commandName] = func;
}

/**
 * Create a SlackBot object
 * @return {SlackBot} return a SlackBot Object
 */
function create() {
  return new SlackBot();
}

var SlackBot = function SlackBot() {
};

SlackBot.prototype.commands = {};
SlackBot.prototype.defaultMessage = 'ごめんね。良くわからない。';
SlackBot.prototype.username = 'gasbot';

/**
 * Execute from a web request
 * @param {Object} e: an event object
 * @return {Object} return itself
 */
SlackBot.prototype.execute = function execute(e) {
  this.setRequestParams(e);
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
 * Get a channel id
 * @return {String} return a channel id
 */
SlackBot.prototype.getChannelId = function getChannelId() {
  return this.channelId;
};

/**
 * Get a default message
 * @return {String} return a default message
 */
SlackBot.prototype.getDefaultMessage = function getDefaultMessage() {
  return this.defaultMessage;
};

/**
 * Get an event object
 * @return {Object} return an event object
 */
SlackBot.prototype.getEvent = function getEvent() {
  return this.event;
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
 * Set a channel id
 * @param {String} channelId: channel id
 * @return {Object} return itself
 */
SlackBot.prototype.setChannelId = function setChannelId(channelId) {
  this.channelId = channelId;
  return this;
};

/**
 * Set an event object
 * @param {Object} e: event object
 * @return {Object} return itself
 */
SlackBot.prototype.setEvent = function setEvent(e) {
  this.event = e;
  this.setChannelId(e.parameter.channel_id);
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
