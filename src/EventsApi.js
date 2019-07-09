/**
 * Register a Bot command
 * @param {String} name: a command name
 * @param {Object} func: a function object to process a command
 * @return {null} return nothing
 */
function registerBotCommand(name, func) {
  EventsApi.prototype.commands[name] = func;
}

/**
 * Register an event handler
 * @param {String} eventType: an event type
 * @param {Function} func: an event handler
 * @return {Object} return itself
 */
function registerEvent(eventType, func) {
  if (!EventsApi.prototype.handlers[eventType]) {
    EventsApi.prototype.handlers[eventType] = [];
  }

  EventsApi.prototype.handlers[eventType].push(func);
}


var EventsApi = function EventsApi(bot) {
  this.bot = bot;
  bot.eventsApi = this;
  this.params = JSON.parse(bot.event.postData.contents);
};

EventsApi.prototype.commands = {};
EventsApi.prototype.defaultMessage = 'そんなコマンドはないよ。';
EventsApi.prototype.handlers = {};

/**
 * Call event handlers
 * @return {Object} return output value
 */
EventsApi.prototype.callEventHandlers = function callEventHandlers() {
  var type = this.params.event.type;
  var handlers = this.handlers[type];
  if (!handlers) {
    console.error('does not have any event handler for ' + type);
    return null;
  }

  console.info('call event handlers for ' + type);
  var output = null;
  for (var i = 0; i < handlers.length; i++) {
    output = handlers[i](this.bot, this.params);
    console.info('output of handler: ' + output);
  }

  return output;
};

/**
 * Execute Events API request
 * @return {Object} return output value
 */
EventsApi.prototype.execute = function execute() {
  var token = this.bot.getVerificationToken();
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
};

/**
 * Get a default message
 * @return {String} return a default message
 */
EventsApi.prototype.getDefaultMessage = function getDefaultMessage() {
  return this.defaultMessage;
};

/**
 * Verify if a token is valid
 * @param {String} token: a verification token
 * @return {boolean} return true or false
 */
EventsApi.prototype.verifyToken = function verifyToken(token) {
  return this.params.token === token;
};


registerBotCommand('help', function commandPing() {
  console.info('help command was called');
  return '吾輩はBotである。ヘルプはまだない。';
});

registerBotCommand('ping', function commandPing() {
  console.info('ping command was called');
  return 'PONG';
});

registerEvent('app_mention', function eventAppMention(bot, params) {
  var eventsApi = bot.eventsApi;
  var command = params.event.text.split(/\s+/)[1];
  console.info('bot command: ' + command);
  var message;
  if (eventsApi.commands.hasOwnProperty(command)) {
    console.info('call command handler for ' + command);
    message = eventsApi.commands[command](bot, params);
  } else {
    console.info('does not have any command handler for ' + command);
    message = eventsApi.getDefaultMessage();
  }
  console.info('output of command handler: ' + message);

  var token = bot.getBotAccessToken();
  var channelId = params.event.channel;
  var webApi = new WebApi(token);
  webApi.chatPostMessage(channelId, message);
  console.info('chat.postMessage(): message: ' + message + ', channelId: ' + channelId + ', botAccessToken: ' + token);

  return message;
});
