function Controller(e, opts) {
  this.initialize(e, opts);
}
exports.Controller = Controller;

Controller.prototype = {
  initialize: function initialize(e, opts) {
    if (e instanceof DI) {
      this.di = e;
      this.config = this.di.getShared('config');
      this.logger = this.di.getShared('logger');
      return;
    }

    var config = this.config = opts ? opts : {};
    var logger = this.logger = new Log(config.logLevel);

    var di = this.di = this.createDI();
    di.setShared('config', config);
    di.setShared('controller', this);
    di.setShared('event', e);
    di.setShared('logger', new Log(config.logLevel));

    logger.info(JSON.stringify(e));
  },

  check: function check() {
    if (!this.config.botAccessToken) {
      this.logger.error('bot access token is not set');
    }

    if (!this.config.channelId) {
      this.logger.error('channel id is not set');
    }

    if (!this.config.verificationToken) {
      this.logger.error('verification token is not set');
    }
  },

  createDI: function createDI() {
    return new DI({
      eventsApi: function service(di) {
        return new EventsApi(di);
      },
      module: function service(di) {
        var e = di.getShared('event');
        if (e.parameter.command) {
          return di.get('slashCommands');
        } else if (e.parameter.text) {
          return di.get('outgoingWebhook');
        }
        return di.get('eventsApi');
      },
      outgoingWebhook: function service(di) {
        return new OutgoingWebhook(di);
      },
      slashCommands: function service(di) {
        return new SlashCommands(di);
      },
      webApi: function service(di) {
        return new WebApi(di.getShared('config').botAccessToken);
      }
    });
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
    var content = this.fire();
    var output = this.finish(content);
    this.sendLog();
    return output;
  },

  finish: function finish(content) {
    var value = content;

    if (!value) {
      return this.createOutputText();
    }

    if (Obj.isObject(value)) {
      return this.createOutputJson(value);
    }

    if (Obj.isGASObject(value)) {
      return value;
    }

    if (!Obj.isString(value)) {
      value = 'invalid output value: ' + value;
      this.logger.error('invalid output value: ' + value);
    }

    var channelId = this.di.getShared('module').getChannelId();
    if (!channelId) {
      return this.createOutputText(value);
    }

    if (this.send(value, channelId)) {
      return this.createOutputText();
    }

    var message = this.di.getShared('webApi').errorMessage;
    console.error(message);
    return this.createOutputText(value + '\n' + message);
  },

  fire: function fire() {
    try {
      return this.di.getShared('module').execute();
    } catch (e) {
      return e.message;
    }
  },

  send: function send(message, channelId) {
    return this.di.getShared('webApi').call('chat.postMessage', 'post', {
      channel: channelId,
      text: message
    });
  },

  sendLog: function sendLog() {
    var value = this.logger.toString();
    if (!value) {
      return;
    }

    console.log(value);

    var channelId = this.config.channelId;
    if (!channelId) {
      return;
    }

    if (this.send(value, channelId)) {
      return;
    }

    console.error(this.di.getShared('webApi').errorMessage);
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
