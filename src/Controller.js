SlackBot.Controller = function Controller(e) {
  this.initialize(e);
};

SlackBot.Controller.prototype = {
  initialize: function initialize(e) {
    console.info(JSON.stringify(e));
    this.event = e;
  },

  /**
   * Execute from a web request
   * @return {Object} return ContentService object
   */
  execute: function execute() {
    var output;
    if (this.event.parameter.command) {
      output = (new SlackBot.SlashCommands(this)).execute();
    } else if (this.event.parameter.text) {
      output = (new SlackBot.OutgoingWebhook(this)).execute();
    } else {
      output = (new SlackBot.EventsApi(this)).execute();
    }

    if (!output) {
      console.info('output empty text/plain');
      return ContentService.createTextOutput('')
        .setMimeType(ContentService.MimeType.TEXT);
    }

    if (typeof output === 'string') {
      console.info('output text/plain: ' + output);
      return ContentService.createTextOutput(output)
        .setMimeType(ContentService.MimeType.TEXT);
    }

    if (output.toString() === '[object Object]') {
      output = JSON.stringify(output);
      console.info('output application/json: ' + output);
      return ContentService.createTextOutput(output)
        .setMimeType(ContentService.MimeType.JSON);
    }

    console.info('output empty text/plain');
    return ContentService.createTextOutput('')
      .setMimeType(ContentService.MimeType.TEXT);
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
    console.info('set a bot access token: ' + token);
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
    console.info('set a verification token: ' + token);
    this.verificationToken = token;
    return this;
  }
};

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^create$" }] */
