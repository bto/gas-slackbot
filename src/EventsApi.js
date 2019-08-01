/**
 * Register a Bot command
 * @param {String} name: a command name
 * @param {Object} func: a function object to process a command
 * @return {null} return nothing
 */
exports.registerBotCommand = function registerBotCommand(name, func) {
  EventsApi.prototype.commands[name] = func;
};

/**
 * Register an event handler
 * @param {String} eventType: an event type
 * @param {Function} func: an event handler
 * @return {Object} return itself
 */
exports.registerEvent = function registerEvent(eventType, func) {
  if (!EventsApi.prototype.handlers[eventType]) {
    EventsApi.prototype.handlers[eventType] = [];
  }

  EventsApi.prototype.handlers[eventType].push(func);
};


function EventsApi(di) {
  this.initialize(di);
}

EventsApi.prototype = {
  defaultMessage: 'そんなコマンドはないよ。',

  commands: {
    nop: function command(di) {
      di.getShared('logger').info('nop command was called');
      return null;
    },

    help: function command(di) {
      di.getShared('logger').info('help command was called');
      return '吾輩はBotである。ヘルプはまだない。';
    },

    ping: function command(di) {
      di.getShared('logger').info('ping command was called');
      return 'PONG';
    }
  },

  handlers: {
    app_mention: [function handler(di, params) {
      var eventsApi = di.getShared('eventsApi');
      var logger = di.getShared('logger');

      var command = params.event.text.split(/\s+/)[1];
      logger.info('bot command: ' + command);
      var message;
      if (eventsApi.commands.hasOwnProperty(command)) {
        logger.info('call command handler for ' + command);
        message = eventsApi.commands[command](di, params);
      } else {
        logger.info('does not have any command handler for ' + command);
        message = eventsApi.getDefaultMessage();
      }
      logger.info('output of command handler: ' + message);

      var channelId = params.event.channel;
      di.get('webApi').call('chat.postMessage', 'post', {
        channel: channelId,
        text: message
      });

      return message;
    }]
  },

  initialize: function initialize(di) {
    if (!di || !(di instanceof DI)) {
      throw new Error('DI object must be passed');
    }

    this.di = di;
    this.logger = di.getShared('logger');
    this.params = JSON.parse(di.getShared('event').postData.contents);
  },

  /**
   * Call event handlers
   * @return {Object} return output value
   */
  callEventHandlers: function callEventHandlers() {
    var type = this.params.event.type;
    var handlers = this.handlers[type];
    if (!handlers) {
      this.logger.error('does not have any event handler for ' + type);
      return null;
    }

    this.logger.info('call event handlers for ' + type);
    var output = null;
    for (var i = 0; i < handlers.length; i++) {
      output = handlers[i](this.di, this.params);
      this.logger.info('output of handler: ' + output);
    }

    return output;
  },

  /**
   * Execute Events API request
   * @return {Object} return output value
   */
  execute: function execute() {
    var controller = this.di.getShared('controller');

    controller.verifyToken(this.params.token);

    var type = this.params.type;
    switch (type) {
    case 'event_callback':
      return this.callEventHandlers();
    case 'url_verification':
      return controller.createOutputText(this.params.challenge);
    default:
      var message = 'not supported events api: ' + type;
      this.logger.error(message);
      throw new Error(message);
    }
  },

  getChannelId: function getChannelId() {
    return this.params.event.channel;
  },

  /**
   * Get a default message
   * @return {String} return a default message
   */
  getDefaultMessage: function getDefaultMessage() {
    return this.defaultMessage;
  }
};

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^registerBotCommand|registerEvent$" }] */
