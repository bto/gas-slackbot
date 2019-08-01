/**
 * Register a slash command
 * @param {String} name: a command name
 * @param {Object} func: a function object to process a command
 * @return {null} return nothing
 */
exports.registerSlashCommand = function registerSlashCommand(name, func) {
  SlashCommands.prototype.handlers[name] = func;
};

function SlashCommands(di) {
  this.initialize(di);
}

SlashCommands.prototype = {
  handlers: {
    ping: function handler(di) {
      di.getShared('logger').info('ping slash command was called');
      return 'PONG';
    }
  },

  initialize: function initialize(di) {
    if (!di || !(di instanceof DI)) {
      throw new Error('DI object must be passed');
    }

    this.di = di;
    this.logger = di.getShared('logger');
    this.params = di.getShared('event').parameter;
  },

  /**
   * Execute Events API request
   * @return {Object} return output value
   */
  execute: function execute() {
    this.di.getShared('controller').verifyToken(this.params.token);

    var command = this.params.command.substring(1);
    var handler = this.handlers[command];
    if (!handler) {
      this.logger.error('does not have any slash command handler for ' + command);
      return null;
    }

    this.logger.info('call slash command handler for ' + command);
    var output = handler(this.di, this.params);
    this.logger.info('output of slash command handler: ' + output);

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

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^registerSlashCommand$" }] */
