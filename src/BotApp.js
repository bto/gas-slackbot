/**
 * Create a BotApp object
 * @param {Object} e: an event object
 * @return {BotApp} return a BotApp Object
 */
function createApp(e) {
  return new BotApp(e);
}

/**
 * Register a Bot command
 * @param {String} name: a command name
 * @param {Object} func: a function object to process a command
 * @return {null} return nothing
 */
function registerCommand(name, func) {
  BotApp.prototype.commands[name] = func;
}

var BotApp = function BotApp(e) {
  if (e) {
    this.setEvent(e);
  }
};

BotApp.prototype.commands = {
  help: function commandPing() {
    return '吾輩はBotである。ヘルプはまだない。';
  },
  ping: function commandPing() {
    return 'PONG';
  }
};
BotApp.prototype.defaultMessage = 'そんなコマンドはないよ。';

/**
 * Execute from a web request
 * @return {Object} return itself
 */
BotApp.prototype.execute = function execute() {
  var eventsApi = new EventsApi(this.getEvent());
  eventsApi.setBotAccessToken(this.getBotAccessToken());
  eventsApi.setVerificationToken(this.getVerificationToken());

  eventsApi.registerHandler('app_mention', function funcAppMention(params) {
    var command = params.event.text.split(/\s+/)[1];
    if (this.commands.hasOwnProperty(command)) {
      return this.commands[command](this, params);
    }
    return this.getDefaultMessage();
  }.bind(this));

  this.eventsApi = eventsApi;
  return eventsApi.execute();
};

/**
 * Get a bot access token
 * @return {String} return a bot access token
 */
BotApp.prototype.getBotAccessToken = function getBotAccessToken() {
  return this.botAccessToken;
};


/**
 * Get a default message
 * @return {String} return a default message
 */
BotApp.prototype.getDefaultMessage = function getDefaultMessage() {
  return this.defaultMessage;
};

/**
 * Get an event object
 * @return {Object} return an event object
 */
BotApp.prototype.getEvent = function getEvent() {
  return this.event;
};

/**
 * Get a verification token
 * @return {String} return a verification token
 */
BotApp.prototype.getVerificationToken = function getVerificationToken() {
  return this.verificationToken;
};

/**
 * Set a bot access token
 * @param {String} botAccessToken: bot access token
 * @return {Object} return itself
 */
BotApp.prototype.setBotAccessToken = function setBotAccessToken(botAccessToken) {
  this.botAccessToken = botAccessToken;
  return this;
};

/**
 * Set an event object
 * @param {Object} e: event object
 * @return {Object} return itself
 */
BotApp.prototype.setEvent = function setEvent(e) {
  console.info(JSON.stringify(e));
  this.event = e;
  return this;
};

/**
 * Set a verification token
 * @param {String} verificationToken: outgoing webhook's verification token
 * @return {Object} return itself
 */
BotApp.prototype.setVerificationToken = function setVerificationToken(verificationToken) {
  this.verificationToken = verificationToken;
  return this;
};

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^createApp|registerCommand$" }] */
