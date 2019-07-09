/**
 * Register a slash command
 * @param {String} name: a command name
 * @param {Object} func: a function object to process a command
 * @return {null} return nothing
 */
function registerSlashCommand(name, func) {
  SlashCommands.prototype.handlers[name] = func;
}

var SlashCommands = function SlashCommands(bot) {
  this.bot = bot;
  this.slashCommands = this;
  this.params = bot.event.parameter;
};

SlashCommands.prototype.handlers = {};

/**
 * Execute Events API request
 * @return {Object} return output value
 */
SlashCommands.prototype.execute = function execute() {
  var token = this.bot.getVerificationToken();
  if (!this.verifyToken(token)) {
    var message = 'invalid verification token: ' + token;
    console.error(message);
    throw new Error(message);
  }

  var command = this.params.command;
  var handler = this.handlers[command];
  if (!handler) {
    console.error('does not have any slash command handler for ' + command);
    return null;
  }

  console.info('call slash command handler for ' + command);
  var output = handler(this.bot, this.params);
  console.info('output of slash command handler: ' + output);

  if (typeof output === 'string') {
    return {
      response_type: 'in_channel',
      text: 'PONG'
    };
  }

  return output;
};

/**
 * Verify if a token is valid
 * @param {String} token: a verification token
 * @return {boolean} return true or false
 */
SlashCommands.prototype.verifyToken = function verifyToken(token) {
  return this.params.token === token;
};


registerSlashCommand('/ping', function slashCommandPing() {
  console.info('ping slash command was called');
  return 'PONG';
});
