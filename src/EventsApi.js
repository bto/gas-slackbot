var EventsApi = function EventsApi(e) {
  if (e) {
    this.setEvent(e);
  }

  this.handlers = {};
};

/**
 * Call event handlers
 * @param {Object} params: request parameters
 * @return {Object} return TextOutput object
 */
EventsApi.prototype.callEventCallback = function callEventCallback(params) {
  var handlers = this.handlers[params.event.type];
  if (!handlers) {
    return null;
  }

  var message = '';
  for (var i = 0; i < handlers.length; i++) {
    var result = handlers[i](params);
    if (typeof result === 'string') {
      message += result;
    }
  }

  if (message.length) {
    var channelId = params.event.channel;
    var webApi = new WebApi(this.getBotAccessToken());
    webApi.callChatPostMessage(channelId, message);
    return message;
  }

  return null;
};

/**
 * Verify url
 * @param {Object} params: request parameters
 * @return {Object} return TextOutput object
 */
EventsApi.prototype.callUrlVerification = function callUrlVerification(params) {
  var output = ContentService.createTextOutput(params.challenge);
  output.setMimeType(ContentService.MimeType.TEXT);
  return output;
};

/**
 * Execute from a web request
 * @return {Object} return itself
 */
EventsApi.prototype.execute = function execute() {
  if (!this.verifyToken()) {
    throw new Error('invalid verification token');
  }

  var params = this.getParams();
  switch (params.type) {
  case 'event_callback':
    return this.callEventCallback(params);
  case 'url_verification':
    return this.callUrlVerification(params);
  default:
    throw new Error('not supported api callback');
  }
};

/**
 * Get a bot access token
 * @return {String} return a bot access token
 */
EventsApi.prototype.getBotAccessToken = function getBotAccessToken() {
  return this.botAccessToken;
};

/**
 * Get a callback type
 * @return {String} return a callback type
 */
EventsApi.prototype.getCallbackType = function getCallbackType() {
  return this.getParam('type');
};

/**
 * Get a challenge code
 * @return {String} return a challenge code
 */
EventsApi.prototype.getChallengeCode = function getChallengeCode() {
  return this.getParam('challenge');
};

/**
 * Get an event object
 * @return {Object} return an event object
 */
EventsApi.prototype.getEvent = function getEvent() {
  return this.event;
};

/**
 * Get an event type
 * @return {String} return an event type
 */
EventsApi.prototype.getEventType = function getEventType() {
  return this.getParam('event').type;
};

/**
 * Get a parameter from HTTP POST body
 * @param {String} key: a parameter key
 * @return {String} return a parameter value
 */
EventsApi.prototype.getParam = function getParam(key) {
  return this.getParams()[key];
};

/**
 * Get parameters from HTTP POST body
 * @return {Object} return a parameters object
 */
EventsApi.prototype.getParams = function getParams() {
  if (this.params) {
    return this.params;
  }

  this.params = JSON.parse(this.getEvent().postData.contents);
  return this.params;
};

/**
 * Get a verification token
 * @return {String} return a verification token
 */
EventsApi.prototype.getVerificationToken = function getVerificationToken() {
  return this.verificationToken;
};

/**
 * Register an event handler
 * @param {String} eventType: an event type
 * @param {Function} func: an event handler
 * @return {Object} return itself
 */
EventsApi.prototype.registerHandler = function registerHandler(eventType, func) {
  if (!this.handlers[eventType]) {
    this.handlers[eventType] = [];
  }

  this.handlers[eventType].push(func);
  return this;
};

/**
 * Set a bot access token
 * @param {String} botAccessToken: bot access token
 * @return {Object} return itself
 */
EventsApi.prototype.setBotAccessToken = function setBotAccessToken(botAccessToken) {
  this.botAccessToken = botAccessToken;
  return this;
};

/**
 * Set an event object
 * @param {Object} e: event object
 * @return {Object} return itself
 */
EventsApi.prototype.setEvent = function setEvent(e) {
  this.event = e;
  this.params = null;
  return this;
};

/**
 * Set a verification token
 * @param {String} verificationToken: verification token
 * @return {Object} return itself
 */
EventsApi.prototype.setVerificationToken = function setVerificationToken(verificationToken) {
  this.verificationToken = verificationToken;
  return this;
};

/**
 * Verify if a token is valid
 * @return {boolean} return true or false
 */
EventsApi.prototype.verifyToken = function verifyToken() {
  return this.getParam('token') === this.getVerificationToken();
};

/* eslint camelcase: 0 */
