/**
 * Create a GasBot object
 * @param {String} bot user OAuth access token
 * @param {String} outgoing webhook's verification token
 * @return {GasBot} return a GasBot Object
 */
function create() {
  return new GasBot();
}

var GasBot = function GasBot() {
}

/**
 * Set an access token
 * @param {String} bot user OAuth access token
 * @return {Object} return itself
 */
GasBot.prototype.setAccesssToken = function setAccesssToken(accessToken) {
  this.accessToken = accessToken;
  return this;
}

/**
 * Set request parameters
 * @param {Object} web app request parameters
 * @return {Object} return itself
 */
GasBot.prototype.setRequestParams = function setRequestParams(request) {
  this.request = request;
  return this;
}

/**
 * Set a verification token
 * @param {String} outgoing webhook's verification token
 * @return {Object} return itself
 */
GasBot.prototype.setVerificationToken = function setVerificationToken(verificationToken) {
  this.verificationToken = verificationToken;
  return this;
}

/**
 * Verify if a token is valid
 * @return {boolean} return true or false
 */
GasBot.prototype.verify = function verify() {
  if (this.request.parameter.token !== this.verificationToken) {
    throw new Error('invalid token.');
  }

  return true;
}
