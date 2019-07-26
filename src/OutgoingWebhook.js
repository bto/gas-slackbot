/**
 * Register an outgoing webhook handler
 * @param {Object} func: a function object
 * @return {null} return nothing
 */
SlackBot.registerOutgoingWebhook = function registerOutgoingWebhook(func) {
  SlackBot.OutgoingWebhook.prototype.handler = func;
};

SlackBot.OutgoingWebhook = function OutgoingWebhook(controller) {
  this.initialize(controller);
};

SlackBot.OutgoingWebhook.prototype = {
  handler: function echo(controller, params) {
    return params.text;
  },

  initialize: function initialize(controller) {
    this.controller = controller;
    this.outgoingWebhook = this;
    this.params = controller.event.parameter;
  },

  execute: function execute() {
    this.controller.verifyToken(this.params.token);

    this.controller.logger.info('call outgoing webhook handler');
    var output = this.handler(this.controller, this.params);
    this.controller.logger.info('output of outgoing webhook handler: ' + output);
    if (typeof output === 'string') {
      return {text: output};
    }

    return output;
  },

  getChannelId: function getChannelId() {
    return this.params.channel_id;
  }
};
