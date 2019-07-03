var EventsApi = function EventsApi(e) {
  this.params = JSON.parse(e.postData.contents);
};

/**
 * Get a callback type
 * @return {String} return a callback type
 */
EventsApi.prototype.getCallbackType = function getCallbackType() {
  return this.params.type;
};

/**
 * Get a challenge code
 * @return {String} return a challenge code
 */
EventsApi.prototype.getChallengeCode = function getChallengeCode() {
  return this.params.challenge;
};

/**
 * Get an event type
 * @return {String} return an event type
 */
EventsApi.prototype.getEventType = function getEventType() {
  return this.params.event.type;
};

/**
 * Verify if a token is valid
 * @param {String} token: a verification token
 * @return {boolean} return true or false
 */
EventsApi.prototype.verifyToken = function verifyToken(token) {
  return this.params.token === token;
};
