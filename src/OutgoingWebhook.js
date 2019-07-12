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
    var token = this.params.token;
    if (!this.verifyToken(token)) {
      var message = 'invalid verification token: ' + token;
      console.error(message);
      throw new Error(message);
    }

    console.info('call outgoing webhook handler');
    var output = this.handler(this.controller, this.params);
    console.info('output of outgoing webhook handler: ' + output);
    if (typeof output === 'string') {
      return {text: output};
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
