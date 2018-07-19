/**
 * Register a Bot command
 * @param {String} commandName: a command name
 * @param {Object} func: a function object to process a command
 * @return {null} return nothing
 */
function command(commandName, func) {
  Bot.prototype.commands[commandName] = func;
}

/**
 * Create a Bot object
 * @param {Object} e: an event object
 * @return {Bot} return a Bot Object
 */
function create(e) {
  return new Bot(e);
}

var Bot = function Bot(e) {
  if (e) {
    this.setEvent(e);
  }
};

Bot.prototype.commands = {};
Bot.prototype.defaultMessage = 'ごめんね。良くわからない。';
Bot.prototype.username = 'gasbot';

/**
 * Execute from a web request
 * @return {Object} return itself
 */
Bot.prototype.execute = function execute() {
  if (!this.verify()) {
    this.send('invalid verification token.');
    return this;
  }

  var params = this.getRequestParam('text').split(/\s+/);
  if (this.commands.hasOwnProperty(params[1])) {
    return this.commands[params[1]](this);
  }

  this.send(this.getDefaultMessage());
  return this;
};

/**
 * Get an access token
 * @return {String} return an access token
 */
Bot.prototype.getAccessToken = function getAccessToken() {
  return this.accessToken;
};

/**
 * Get a channel id
 * @return {String} return a channel id
 */
Bot.prototype.getChannelId = function getChannelId() {
  return this.channelId;
};

/**
 * Get a default message
 * @return {String} return a default message
 */
Bot.prototype.getDefaultMessage = function getDefaultMessage() {
  return this.defaultMessage;
};

/**
 * Get an event object
 * @return {Object} return an event object
 */
Bot.prototype.getEvent = function getEvent() {
  return this.event;
};

/**
 * Get a request parameter
 * @param {String} name: a parameter name
 * @return {String} return a request parameter
 */
Bot.prototype.getRequestParam = function getRequestParam(name) {
  return this.event.parameter[name];
};

/**
 * Get an api object
 * @return {Object} return an api object
 */
Bot.prototype.getApi = function getApi() {
  if (this.api) {
    return this.api;
  }

  var accessToken = this.getAccessToken();
  if (!accessToken) {
    throw new Error('invalid access token.');
  }

  this.api = SlackApp.create(accessToken);
  return this.api;
};

/**
 * Get a username
 * @return {String} return a username
 */
Bot.prototype.getUsername = function getUsername() {
  return this.username;
};

/**
 * Get a verification token
 * @return {String} return a verification token
 */
Bot.prototype.getVerificationToken = function getVerificationToken() {
  return this.verificationToken;
};

/**
 * Send a message
 * @param {String} message: a message string
 * @return {null} return nothing
 */
Bot.prototype.send = function send(message) {
  this.getApi().chatPostMessage(this.getChannelId(), message, {username: this.getUsername()});
};

/**
 * Set an access token
 * @param {String} accessToken: bot user OAuth access token
 * @return {Object} return itself
 */
Bot.prototype.setAccessToken = function setAccessToken(accessToken) {
  this.accessToken = accessToken;
  this.slackApi = null;
  return this;
};

/**
 * Set a default message
 * @param {String} defaultMessage: default message
 * @return {Object} return itself
 */
Bot.prototype.setDefaultMessage = function setDefaultMessage(defaultMessage) {
  this.defaultMessage = defaultMessage;
  return this;
};

/**
 * Set a channel id
 * @param {String} channelId: channel id
 * @return {Object} return itself
 */
Bot.prototype.setChannelId = function setChannelId(channelId) {
  this.channelId = channelId;
  return this;
};

/**
 * Set an event object
 * @param {Object} e: event object
 * @return {Object} return itself
 */
Bot.prototype.setEvent = function setEvent(e) {
  this.event = e;
  this.setChannelId(this.getRequestParam('channel_id'));
  return this;
};

/**
 * Set an username
 * @param {String} username: bot user name
 * @return {Object} return itself
 */
Bot.prototype.setUsername = function setUsername(username) {
  this.username = username;
  return this;
};

/**
 * Set a verification token
 * @param {String} verificationToken: outgoing webhook's verification token
 * @return {Object} return itself
 */
Bot.prototype.setVerificationToken = function setVerificationToken(verificationToken) {
  this.verificationToken = verificationToken;
  return this;
};

/**
 * Verify if a token is valid
 * @return {boolean} return true or false
 */
Bot.prototype.verify = function verify() {
  return this.getRequestParam('token') === this.getVerificationToken();
};

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^create|command$" }] */
