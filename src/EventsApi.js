var EventsApi = function EventsApi(e) {
  if (e) {
    this.setEvent(e);
  }

  this.handlers = {};
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
