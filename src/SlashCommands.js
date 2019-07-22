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
    ping: function handler(controller) {
      controller.log.info('ping slash command was called');
      return 'PONG';
    }
  },

  initialize: function initialize(controller) {
    this.controller = controller;
    this.slashCommands = this;
    this.params = controller.event.parameter;
    this.args = this.getArgs();
  },

  /**
   * Execute Events API request
   * @return {Object} return output value
   */
  execute: function execute() {
    this.controller.verifyToken(this.params.token);

    var command = this.params.command.substring(1);
    var handler = this.handlers[command];
    if (!handler) {
      this.controller.log.error('does not have any slash command handler for ' + command);
      return null;
    }

    this.controller.log.info('call slash command handler for ' + command);
    var output = handler(this.controller, this.params);
    this.controller.log.info('output of slash command handler: ' + output);

    if (typeof output === 'string') {
      return {
        response_type: 'in_channel',
        text: output
      };
    }

    return output;
  },

  getArgs: function getArgs() {
    if (!this.params.text) {
      return [];
    }

    return this.params.text.trim().split(/\s+/);
  },

  getChannelId: function getChannelId() {
    return this.params.channel_id;
  }
};
