/**
 * Register a Bot command
 * @param {String} name: a command name
 * @param {Object} func: a function object to process a command
 * @return {null} return nothing
 */
SlackBot.registerBotCommand = function registerBotCommand(name, func) {
  SlackBot.EventsApi.prototype.commands[name] = func;
};

/**
 * Register an event handler
 * @param {String} eventType: an event type
 * @param {Function} func: an event handler
 * @return {Object} return itself
 */
SlackBot.registerEvent = function registerEvent(eventType, func) {
  if (!SlackBot.EventsApi.prototype.handlers[eventType]) {
    SlackBot.EventsApi.prototype.handlers[eventType] = [];
  }

  SlackBot.EventsApi.prototype.handlers[eventType].push(func);
};


SlackBot.EventsApi = function EventsApi(di) {
  this.initialize(di);
};

SlackBot.EventsApi.prototype = {
  defaultMessage: 'そんなコマンドはないよ。',

  commands: {
    nop: function command(controller) {
      controller.logger.info('nop command was called');
      return null;
    },

    help: function command(controller) {
      controller.logger.info('help command was called');
      return '吾輩はBotである。ヘルプはまだない。';
    },

    ping: function command(controller) {
      controller.logger.info('ping command was called');
      return 'PONG';
    }
  },

  handlers: {
    app_mention: [function handler(controller, params) {
      var eventsApi = controller.eventsApi;
      var command = params.event.text.split(/\s+/)[1];
      controller.logger.info('bot command: ' + command);
      var message;
      if (eventsApi.commands.hasOwnProperty(command)) {
        controller.logger.info('call command handler for ' + command);
        message = eventsApi.commands[command](controller, params);
      } else {
        controller.logger.info('does not have any command handler for ' + command);
        message = eventsApi.getDefaultMessage();
      }
      controller.logger.info('output of command handler: ' + message);

      var channelId = params.event.channel;
      controller.webApi.call('chat.postMessage', 'post', {
        channel: channelId,
        text: message
      });

      return message;
    }]
  },

  initialize: function initialize(di) {
    if (!di || !(di instanceof SlackBot.DI)) {
      throw new Error('SlackBot.DI object must be passed');
    }

    var controller = di.get('controller');
    this.controller = controller;
    controller.eventsApi = this;
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
      this.controller.logger.error('does not have any event handler for ' + type);
      return null;
    }

    this.controller.logger.info('call event handlers for ' + type);
    var output = null;
    for (var i = 0; i < handlers.length; i++) {
      output = handlers[i](this.controller, this.params);
      this.controller.logger.info('output of handler: ' + output);
    }

    return output;
  },

  /**
   * Execute Events API request
   * @return {Object} return output value
   */
  execute: function execute() {
    this.controller.verifyToken(this.params.token);

    var type = this.params.type;
    switch (type) {
    case 'event_callback':
      return this.callEventHandlers();
    case 'url_verification':
      return this.controller.createOutputText(this.params.challenge);
    default:
      var message = 'not supported events api: ' + type;
      this.controller.logger.error(message);
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
