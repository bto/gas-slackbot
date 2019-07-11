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


SlackBot.EventsApi = function EventsApi(controller) {
  this.initialize(controller);
};

SlackBot.EventsApi.prototype = {
  commands: {},
  defaultMessage: 'そんなコマンドはないよ。',
  handlers: {},

  initialize: function initialize(controller) {
    this.controller = controller;
    controller.eventsApi = this;
    this.params = JSON.parse(controller.event.postData.contents);
  },

  /**
   * Call event handlers
   * @return {Object} return output value
   */
  callEventHandlers: function callEventHandlers() {
    var type = this.params.event.type;
    var handlers = this.handlers[type];
    if (!handlers) {
      console.error('does not have any event handler for ' + type);
      return null;
    }

    console.info('call event handlers for ' + type);
    var output = null;
    for (var i = 0; i < handlers.length; i++) {
      output = handlers[i](this.controller, this.params);
      console.info('output of handler: ' + output);
    }

    return output;
  },

  /**
   * Execute Events API request
   * @return {Object} return output value
   */
  execute: function execute() {
    var token = this.controller.getVerificationToken();
    if (!this.verifyToken(token)) {
      var message = 'invalid verification token: ' + token;
      console.error(message);
      throw new Error(message);
    }

    var type = this.params.type;
    switch (type) {
    case 'event_callback':
      return this.callEventHandlers();
    case 'url_verification':
      return this.params.challenge;
    default:
      message = 'not supported events api: ' + type;
      console.error(message);
      throw new Error(message);
    }
  },

  /**
   * Get a default message
   * @return {String} return a default message
   */
  getDefaultMessage: function getDefaultMessage() {
    return this.defaultMessage;
  },

  /**
   * Verify if a token is valid
   * @param {String} token: a verification token
   * @return {boolean} return true or false
   */
  verifyToken: function verifyToken(token) {
    return this.params.token === token;
  }
};


SlackBot.registerBotCommand('nop', function commandPing() {
  console.info('nop command was called');
  return null;
});

SlackBot.registerBotCommand('help', function commandPing() {
  console.info('help command was called');
  return '吾輩はBotである。ヘルプはまだない。';
});

SlackBot.registerBotCommand('ping', function commandPing() {
  console.info('ping command was called');
  return 'PONG';
});

SlackBot.registerEvent('app_mention', function eventAppMention(controller, params) {
  var eventsApi = controller.eventsApi;
  var command = params.event.text.split(/\s+/)[1];
  console.info('bot command: ' + command);
  var message;
  if (eventsApi.commands.hasOwnProperty(command)) {
    console.info('call command handler for ' + command);
    message = eventsApi.commands[command](controller, params);
  } else {
    console.info('does not have any command handler for ' + command);
    message = eventsApi.getDefaultMessage();
  }
  console.info('output of command handler: ' + message);

  var channelId = params.event.channel;
  controller.webApi.call('chat.postMessage', 'post', {
    channel: channelId,
    text: message
  });

  return message;
});
