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

/**
 * Execute from a web request
 * @return {Object} return itself
 */
BotApp.prototype.execute = function execute() {
  this.eventsApi = new EventsApi(this.getEvent());

  this.eventsApi.registerHandler('app_mention', function funcAppMention(params) {
    var command = params.event.text.split(/\s+/)[1];
    if (this.commands.hasOwnProperty(command)) {
      return this.commands[command](this, params);
    }
    return this.getDefaultMessage();
  }.bind(this));

  return this.eventsApi.execute();
};

/**
 * Get an event object
 * @return {Object} return an event object
 */
BotApp.prototype.getEvent = function getEvent() {
  return this.event;
};

/**
 * Set an event object
 * @param {Object} e: event object
 * @return {Object} return itself
 */
BotApp.prototype.setEvent = function setEvent(e) {
  this.event = e;
  return this;
};

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^createApp|registerCommand$" }] */
