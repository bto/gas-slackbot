var EventsApi = function EventsApi(e) {
  if (e) {
    this.setEvent(e);
  }
};

EventsApi.prototype.handlers = {};

/**
 * Register an event handler
 * @param {String} eventType: an event type
 * @param {Function} func: an event handler
 * @return {Object} return itself
 */
EventsApi.registerHandler = function registerHandler(eventType, func) {
  if (!EventsApi.prototype.handlers[eventType]) {
    EventsApi.prototype.handlers[eventType] = [];
  }

  EventsApi.prototype.handlers[eventType].push(func);
  return true;
};

/**
 * Execute from a web request
 * @return {Object} return itself
 */
EventsApi.prototype.execute = function execute() {
  var token = this.getVerificationToken();
  if (token && !this.verify()) {
    throw new Error('invalid verification token');
  }

  return this._call(this.getParams());
};

/**
 * Get an event object
 * @return {Object} return an event object
 */
EventsApi.prototype.getEvent = function getEvent() {
  return this.event;
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
 * @param {String} verificationToken: outgoing webhook's verification token
 * @return {Object} return itself
 */
EventsApi.prototype.setVerificationToken = function setVerificationToken(verificationToken) {
  this.verificationToken = verificationToken;
  return this;
};

/**
 * Verify if a token is valid
 * @param {String} token: verification token
 * @return {boolean} return true or false
 */
EventsApi.prototype.verify = function verify(token) {
  return this.getParam('token') === token;
};

EventsApi.prototype._call = function _call(params) {
  var method = '_call_' + params.type;
  if (!(this[method] instanceof Function)) {
    throw new Error('not supported event type: ' + params.type);
  }

  var content = this[method].call(this, params);

  var output = ContentService.createTextOutput();
  if (typeof content === 'string') {
    output.setMimeType(ContentService.MimeType.TEXT);
  } else {
    content = JSON.stringify(content);
    output.setMimeType(ContentService.MimeType.JSON);
  }
  output.setContent(content);

  return output;
};

EventsApi.prototype._call_url_verification = function _call_url_verification(params) {
  return params.challenge;
};

/* eslint camelcase: 0 */
