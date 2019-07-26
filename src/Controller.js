SlackBot.Controller = function Controller(e, opts, di) {
  this.initialize(e, opts, di);
};

SlackBot.Controller.prototype = {
  initialize: function initialize(e, opts, diObj) {
    this.event = e;

    var di = this.di = diObj ? diObj : this.createDI();

    var config = di.getShared('config');
    config.setAll(opts);
    config.setCommon('di', di);

    this.logger = di.get('logger');

    this.logger.info(JSON.stringify(e));
  },

  check: function check() {
    if (!this.botAccessToken) {
      this.logger.error('bot access token is not set');
    }

    if (!this.verificationToken) {
      this.logger.error('verification token is not set');
    }
  },

  createDI: function createDI() {
    return new SlackBot.DI({
      controller: this,
      eventsApi: function eventsApi(config) {
        return new SlackBot.EventsApi(config.di.get('controller'));
      },
      logger: function logger(config) {
        return new SlackBot.Log(config.level);
      },
      outgoingWebhook: function outgoingWebhook(config) {
        return new SlackBot.OutgoingWebhook(config.di.get('controller'));
      },
      slashCommands: function slashCommands(config) {
        return new SlackBot.SlashCommands(config.di.get('controller'));
      }
    });
  },

  createModule: function createModule() {
    if (this.event.parameter.command) {
      return this.di.get('slashCommands');
    } else if (this.event.parameter.text) {
      return this.di.get('outgoingWebhook');
    }
    return this.di.get('eventsApi');
  },

  createOutputJson: function createOutputJson(content) {
    var output = JSON.stringify(content);
    this.logger.info('output application/json: ' + output);
    return ContentService.createTextOutput(output).setMimeType(ContentService.MimeType.JSON);
  },

  createOutputText: function createOutputText(content) {
    var output = content ? content : '';
    this.logger.info('output text/plain: ' + output);
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

    this.logger.error('invalid output content: ' + content);
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
    var content = this.logger.toString();
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
    this.logger.debug('set a bot access token: ' + token);
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
    this.logger.debug('set a channel id: ' + channelId);
    this.channelId = channelId;
    return this;
  },

  /**
   * Set a verification token
   * @param {String} token: verification token
   * @return {Object} return itself
   */
  setVerificationToken: function setVerificationToken(token) {
    this.logger.debug('set a verification token: ' + token);
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
    this.logger.warn(message);
    throw new Error(message);
  }
};

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^create$" }] */
