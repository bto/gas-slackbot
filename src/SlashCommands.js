/**
 * Register a slash command
 * @param {String} name: a command name
 * @param {Object} func: a function object to process a command
 * @return {null} return nothing
 */
SlackBot.registerSlashCommand = function registerSlashCommand(name, func) {
  SlackBot.SlashCommands.prototype.handlers[name] = func;
};

SlackBot.SlashCommands = function SlashCommands(controller) {
  this.initialize(controller);
};

SlackBot.SlashCommands.prototype = {
  handlers: {
    'ping': function slashCommandPing() {
      console.info('ping slash command was called');
      return 'PONG';
    }
  },

  initialize: function initialize(controller) {
    this.controller = controller;
    this.slashCommands = this;
    this.params = controller.event.parameter;
    this.args = this.getArgs();
  },

  getArgs: function getArgs() {
    if (!this.params.text) {
      return [];
    }

    return this.params.text.trim().split(/\s+/);
  },

  /**
   * Execute Events API request
   * @return {Object} return output value
   */
  execute: function execute() {
    var token = this.params.token;
    if (!this.verifyToken(token)) {
      var message = 'invalid verification token: ' + token;
      console.error(message);
      throw new Error(message);
    }

    var command = this.params.command.substring(1);
    var handler = this.handlers[command];
    if (!handler) {
      console.error('does not have any slash command handler for ' + command);
      return null;
    }

    console.info('call slash command handler for ' + command);
    var output = handler(this.controller, this.params);
    console.info('output of slash command handler: ' + output);

    if (typeof output === 'string') {
      return {
        response_type: 'in_channel',
        text: output
      };
    }

    return output;
  },

  /**
   * Verify if a token is valid
   * @param {String} token: a verification token
   * @return {boolean} return true or false
   */
  verifyToken: function verifyToken(token) {
    return this.controller.getVerificationToken() === token;
  }
};
