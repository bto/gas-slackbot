SlackBot.Controller = function Controller(e, opts) {
  this.initialize(e, opts);
};

SlackBot.Controller.prototype = {
  initialize: function initialize(e, opts) {
    if (e instanceof SlackBot.DI) {
      this.di = e;
      this.config = this.di.getShared('config');
      this.logger = this.di.getShared('logger');
      return;
    }

    var config = this.config = opts ? opts : {};
    var logger = this.logger = new SlackBot.Log(config.logLevel);

    var di = this.di = this.createDI();
    di.setShared('config', config);
    di.setShared('controller', this);
    di.setShared('event', e);
    di.setShared('logger', new SlackBot.Log(config.logLevel));

    logger.info(JSON.stringify(e));
  },

  check: function check() {
    if (!this.config.botAccessToken) {
      this.logger.error('bot access token is not set');
    }

    if (!this.config.verificationToken) {
      this.logger.error('verification token is not set');
    }
  },

  createDI: function createDI() {
    return new SlackBot.DI({
      eventsApi: function service(di) {
        return new SlackBot.EventsApi(di);
      },
      outgoingWebhook: function service(di) {
        return new SlackBot.OutgoingWebhook(di);
      },
      slashCommands: function service(di) {
        return new SlackBot.SlashCommands(di);
      },
      webApi: function service(di) {
        return new SlackBot.WebApi(di.getShared('config').botAccessToken);
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
   * Get a channel id
   * @return {String} return a channel id
   */
  getChannelId: function getChannelId() {
    if (!this.module) {
      return this.config.channelId;
    }

    var channelId = this.module.getChannelId();
    if (channelId) {
      return channelId;
    }

    return this.config.channelId;
  },

  send: function send(message) {
    if (!message) {
      return true;
    }

    var channelId = this.getChannelId();
    if (!channelId) {
      return false;
    }

    var webApi = this.di.get('webApi');
    var params = {
      channel: channelId,
      text: message
    };
    if (!webApi.call('chat.postMessage', 'post', params)) {
      throw new Error(webApi.errorMessage);
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
   * Verify if a token is valid
   * @param {String} token: a verification token
   * @return {null} return null
   */
  verifyToken: function verifyToken(token) {
    if (this.config.verificationToken === token) {
      return null;
    }

    var message = 'invalid verification token: ' + token;
    this.logger.warn(message);
    throw new Error(message);
  }
};

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^create$" }] */
