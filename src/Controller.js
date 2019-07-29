SlackBot.Controller = function Controller(e, config) {
  this.initialize(e, config);
};

SlackBot.Controller.prototype = {
  initialize: function initialize(e, config) {
    var di;
    if (e instanceof SlackBot.DI) {
      di = this.di = e;
    } else {
      di = this.di = this.createDI();
      di.setShared('config', config ? config : {});
      di.setShared('controller', this);
      di.setShared('event', e);
    }

    this.logger = di.getShared('logger');
    this.logger.info(JSON.stringify(e));
  },

  check: function check() {
    var config = this.di.getShared('config');

    if (!this.botAccessToken) {
      this.logger.error('bot access token is not set');
    }

    if (!config.verificationToken) {
      this.logger.error('verification token is not set');
    }
  },

  createDI: function createDI() {
    return new SlackBot.DI({
      eventsApi: function service(di) {
        return new SlackBot.EventsApi(di);
      },
      logger: function service(di) {
        return new SlackBot.Log(di.getShared('config').logLevel);
      },
      outgoingWebhook: function service(di) {
        return new SlackBot.OutgoingWebhook(di);
      },
      slashCommands: function service(di) {
        return new SlackBot.SlashCommands(di);
      }
    });
  },

  createModule: function createModule() {
    var e = this.di.getShared('event');
    if (e.parameter.command) {
      return this.di.getShared('slashCommands');
    } else if (e.parameter.text) {
      return this.di.getShared('outgoingWebhook');
    }
    return this.di.getShared('eventsApi');
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
    var channelId = this.di.getShared('config').channelId;

    if (!this.module) {
      return channelId;
    }

    var moduleChannelId = this.module.getChannelId();
    if (moduleChannelId) {
      return moduleChannelId;
    }

    return channelId;
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
   * Verify if a token is valid
   * @param {String} token: a verification token
   * @return {null} return null
   */
  verifyToken: function verifyToken(token) {
    var verificationToken = this.di.getShared('config').verificationToken;
    if (verificationToken === token) {
      return null;
    }

    var message = 'invalid verification token: ' + token;
    this.logger.warn(message);
    throw new Error(message);
  }
};

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^create$" }] */
