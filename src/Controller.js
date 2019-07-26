SlackBot.Controller = function Controller(e, opts, di) {
  this.initialize(e, opts, di);
};

SlackBot.Controller.prototype = {
  initialize: function initialize(e, opts, diObj) {
    this.event = e;

    var di = diObj ? diObj : this.createDI();
    di.getShared('config').setAll(opts);

    this.di = di;
    this.log = di.get('logger');

    this.log.info(JSON.stringify(e));
  },

  check: function check() {
    if (!this.botAccessToken) {
      this.log.error('bot access token is not set');
    }

    if (!this.verificationToken) {
      this.log.error('verification token is not set');
    }
  },

  createDI: function createDI() {
    return new SlackBot.DI({
      logger: function logger(config) {
        return new SlackBot.Log(config.level);
      }
    });
  },

  createModule: function createModule() {
    if (this.event.parameter.command) {
      return new SlackBot.SlashCommands(this);
    } else if (this.event.parameter.text) {
      return new SlackBot.OutgoingWebhook(this);
    }
    return new SlackBot.EventsApi(this);
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
    this.check();
    this.module = this.createModule();
    var content = this.fire();
    var output = this.finish(content);
    this.sendLog();
    return output;
  },

  finish: function finish(content) {
    if (!content) {
      return this.createOutputText();
    }

    if (SlackBot.Obj.isString(content)) {
      try {
        if (this.send(content)) {
          return this.createOutputText();
        }
        return this.createOutputText(content);
      } catch (e) {
        console.error(e.message);
        return this.createOutputText(e.message);
      }
    }

    if (SlackBot.Obj.isObject(content)) {
      return this.createOutputJson(content);
    }

    if (SlackBot.Obj.isGASObject(content)) {
      return content;
    }

    this.log.error('invalid output content: ' + content);
    return this.createOutputText();
  },

  fire: function fire() {
    try {
      return this.module.execute();
    } catch (e) {
      return e.message;
    }
  },

  /**
   * Get a bot access token
   * @return {String} return a bot access token
   */
  getBotAccessToken: function getBotAccessToken() {
    return this.botAccessToken;
  },

  /**
   * Get a channel id
   * @return {String} return a channel id
   */
  getChannelId: function getChannelId() {
    if (!this.module) {
      return this.channelId;
    }

    var channelId = this.module.getChannelId();
    if (channelId) {
      return channelId;
    }

    return this.channelId;
  },

  /**
   * Get a verification token
   * @return {String} return a verification token
   */
  getVerificationToken: function getVerificationToken() {
    return this.verificationToken;
  },

  send: function send(message) {
    if (!message) {
      return true;
    }

    var channelId = this.getChannelId();
    if (!this.webApi || !channelId) {
      return false;
    }

    var params = {
      channel: channelId,
      text: message
    };
    if (!this.webApi.call('chat.postMessage', 'post', params)) {
      throw new Error(this.webApi.errorMessage);
    }

    return true;
  },

  sendLog: function sendLog() {
    var content = this.log.toString();
    try {
      if (this.send(content)) {
        return true;
      }
      console.error(content);
      return false;
    } catch (e) {
      console.error(e.message);
      return false;
    }
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
   * Set a channel id
   * @param {String} channelId: channel id
   * @return {Object} return itself
   */
  setChannelId: function setChannelId(channelId) {
    this.log.debug('set a channel id: ' + channelId);
    this.channelId = channelId;
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
