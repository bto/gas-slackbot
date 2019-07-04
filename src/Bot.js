/**
 * Create a Bot object
 * @param {Object} e: an event object
 * @return {Bot} return a Bot Object
 */
function create(e) {
  return new Bot(e);
}

/**
 * Register a Bot command
 * @param {String} name: a command name
 * @param {Object} func: a function object to process a command
 * @return {null} return nothing
 */
function registerBotCommand(name, func) {
  Bot.prototype.botCommands[name] = func;
}

/**
 * Register an event handler
 * @param {String} eventType: an event type
 * @param {Function} func: an event handler
 * @return {Object} return itself
 */
function registerEventHandler(eventType, func) {
  if (!Bot.prototype.eventHandlers[eventType]) {
    Bot.prototype.eventHandlers[eventType] = [];
  }

  Bot.prototype.eventHandlers[eventType].push(func);
}

var Bot = function Bot(e) {
  if (e) {
    this.setEvent(e);
  }
};

Bot.prototype.botCommands = {};
Bot.prototype.defaultMessage = 'そんなコマンドはないよ。';
Bot.prototype.eventHandlers = {};

/**
 * Execute for Events API
 * @return {Object} return mixed value
 */
Bot.prototype.actAsEventsApi = function actAsEventsApi() {
  var eventsApi = new EventsApi(this.getEvent());

  var token = this.getVerificationToken();
  if (!eventsApi.verifyToken(token)) {
    var message = 'invalid verification token: ' + token;
    console.error(message);
    throw new Error(message);
  }

  var type = eventsApi.getCallbackType();
  switch (type) {
  case 'event_callback':
    return this.callEventHandlers(eventsApi);
  case 'url_verification':
    return eventsApi.getChallengeCode();
  default:
    message = 'not supported events api: ' + type;
    console.error(message);
    throw new Error(message);
  }
};

/**
 * Call event handlers
 * @param {Object} eventsApi: EventsApi object
 * @return {Object} return mixed value
 */
Bot.prototype.callEventHandlers = function callEventHandlers(eventsApi) {
  var type = eventsApi.getEventType();
  var handlers = this.eventHandlers[type];
  if (!handlers) {
    console.error('does not have any event handler for ' + type);
    return null;
  }

  console.info('call event handlers for ' + type);
  var output = null;
  for (var i = 0; i < handlers.length; i++) {
    output = handlers[i](this, eventsApi.params);
    console.info('output of handler: ' + output);
  }

  return output;
};

/**
 * Execute from a web request
 * @return {Object} return ContentService object
 */
Bot.prototype.execute = function execute() {
  var output = this.actAsEventsApi();

  if (typeof output === 'string') {
    console.info('output text/plain: ' + output);
    output = ContentService.createTextOutput(output);
    output.setMimeType(ContentService.MimeType.TEXT);
    return output;
  }

  return null;
};

/**
 * Get a bot access token
 * @return {String} return a bot access token
 */
Bot.prototype.getBotAccessToken = function getBotAccessToken() {
  return this.botAccessToken;
};


/**
 * Get a default message
 * @return {String} return a default message
 */
Bot.prototype.getDefaultMessage = function getDefaultMessage() {
  return this.defaultMessage;
};

/**
 * Get an event object
 * @return {Object} return an event object
 */
Bot.prototype.getEvent = function getEvent() {
  return this.event;
};

/**
 * Get a verification token
 * @return {String} return a verification token
 */
Bot.prototype.getVerificationToken = function getVerificationToken() {
  return this.verificationToken;
};

/**
 * Set a bot access token
 * @param {String} token: bot access token
 * @return {Object} return itself
 */
Bot.prototype.setBotAccessToken = function setBotAccessToken(token) {
  console.info('set a bot access token: ' + token);
  this.botAccessToken = token;
  return this;
};

/**
 * Set an event object
 * @param {Object} e: event object
 * @return {Object} return itself
 */
Bot.prototype.setEvent = function setEvent(e) {
  console.info(JSON.stringify(e));
  this.event = e;
  return this;
};

/**
 * Set a verification token
 * @param {String} token: verification token
 * @return {Object} return itself
 */
Bot.prototype.setVerificationToken = function setVerificationToken(token) {
  console.info('set a verification token: ' + token);
  this.verificationToken = token;
  return this;
};


registerBotCommand('help', function commandPing() {
  console.info('help command was called');
  return '吾輩はBotである。ヘルプはまだない。';
});

registerBotCommand('ping', function commandPing() {
  console.info('ping command was called');
  return 'PONG';
});

registerEventHandler('app_mention', function eventAppMention(bot, params) {
  var command = params.event.text.split(/\s+/)[1];
  console.info('bot command: ' + command);
  var message;
  if (bot.botCommands.hasOwnProperty(command)) {
    console.info('call command handler for ' + command);
    message = bot.botCommands[command](bot, params);
  } else {
    console.info('does not have any command handler for ' + command);
    message = bot.getDefaultMessage();
  }
  console.info('output of command handler: ' + message);

  var token = bot.getBotAccessToken();
  var channelId = params.event.channel;
  var webApi = new WebApi(token);
  webApi.callChatPostMessage(channelId, message);
  console.info('chat.postMessage(): message: ' + message + ', channelId: ' + channelId + ', botAccessToken: ' + token);

  return message;
});

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^create$" }] */
