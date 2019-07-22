SlackBot.Controller = function Controller(e, opts) {
  this.initialize(e, opts);
};

SlackBot.Controller.prototype = {
  initialize: function initialize(e, options) {
    this.event = e;

    var opts = options ? options : {};
    this.log = new SlackBot.Log(opts.logLevel);

    this.log.info(JSON.stringify(e));
  },

  createOutput: function createOutput(content) {
    if (!content) {
      return this.createOutputText();
    }

    if (typeof content === 'string') {
      return this.createOutputText(content);
    }

    if (content.toString() === '[object Object]') {
      return this.createOutputJson(content);
    }

    return this.createOutputText();
  },

  createOutputJson: function createOutputJson(content) {
    var output = JSON.stringify(content);
    this.log.info('output application/json: ' + output);
    return ContentService.createTextOutput(output).setMimeType(ContentService.MimeType.JSON);
  },

  createOutputText: function createOutputText(content) {
    var output = content ? content : '';
    this.log.info('output text/plain: ' + output);
    return ContentService.createTextOutput(output).setMimeType(ContentService.MimeType.TEXT);
  },

  /**
   * Execute from a web request
   * @return {Object} return ContentService object
   */
  execute: function execute() {
    var output;
    try {
      output = this.fire();
    } catch (e) {
      output = e.errorMessage;
    }

    return this.createOutput(output);
  },

  fire: function fire() {
    if (this.event.parameter.command) {
      return (new SlackBot.SlashCommands(this)).execute();
    } else if (this.event.parameter.text) {
      return (new SlackBot.OutgoingWebhook(this)).execute();
    }
    return (new SlackBot.EventsApi(this)).execute();
  },

  /**
   * Get a bot access token
   * @return {String} return a bot access token
   */
  getBotAccessToken: function getBotAccessToken() {
    return this.botAccessToken;
  },

  /**
   * Get a verification token
   * @return {String} return a verification token
   */
  getVerificationToken: function getVerificationToken() {
    return this.verificationToken;
  },

  /**
   * Set a bot access token
   * @param {String} token: bot access token
   * @return {Object} return itself
   */
  setBotAccessToken: function setBotAccessToken(token) {
    this.log.debug('set a bot access token: ' + token);
    this.botAccessToken = token;
    this.webApi = new SlackBot.WebApi(token);
    return this;
  },

  /**
   * Set a verification token
   * @param {String} token: verification token
   * @return {Object} return itself
   */
  setVerificationToken: function setVerificationToken(token) {
    this.log.debug('set a verification token: ' + token);
    this.verificationToken = token;
    return this;
  },

  /**
   * Verify if a token is valid
   * @param {String} token: a verification token
   * @return {null} return null
   */
  verifyToken: function verifyToken(token) {
    if (this.getVerificationToken() === token) {
      return null;
    }

    var message = 'invalid verification token: ' + token;
    this.log.warn(message);
    throw new Error(message);
  }
};

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^create$" }] */
