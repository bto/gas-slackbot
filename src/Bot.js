var Bot = function Bot(e) {
  console.info(JSON.stringify(e));
  this.event = e;
};

/**
 * Execute from a web request
 * @return {Object} return ContentService object
 */
Bot.prototype.execute = function execute() {
  var output = (new EventsApi(this)).execute();

  if (typeof output === 'string') {
    console.info('output text/plain: ' + output);
    output = ContentService.createTextOutput(output);
    output.setMimeType(ContentService.MimeType.TEXT);
    return output;
  }

  return null;
};

/**
 * Get a bot access token
 * @return {String} return a bot access token
 */
Bot.prototype.getBotAccessToken = function getBotAccessToken() {
  return this.botAccessToken;
};

/**
 * Get a verification token
 * @return {String} return a verification token
 */
Bot.prototype.getVerificationToken = function getVerificationToken() {
  return this.verificationToken;
};

/**
 * Set a bot access token
 * @param {String} token: bot access token
 * @return {Object} return itself
 */
Bot.prototype.setBotAccessToken = function setBotAccessToken(token) {
  console.info('set a bot access token: ' + token);
  this.botAccessToken = token;
  return this;
};

/**
 * Set a verification token
 * @param {String} token: verification token
 * @return {Object} return itself
 */
Bot.prototype.setVerificationToken = function setVerificationToken(token) {
  console.info('set a verification token: ' + token);
  this.verificationToken = token;
  return this;
};

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^create$" }] */
