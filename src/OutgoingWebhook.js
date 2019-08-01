/**
 * Register an outgoing webhook handler
 * @param {Object} func: a function object
 * @return {null} return nothing
 */
exports.registerOutgoingWebhook = function registerOutgoingWebhook(func) {
  OutgoingWebhook.prototype.handler = func;
};

function OutgoingWebhook(di) {
  this.initialize(di);
}

OutgoingWebhook.prototype = {
  handler: function echo(di, params) {
    return params.text;
  },

  initialize: function initialize(di) {
    if (!di || !(di instanceof DI)) {
      throw new Error('DI object must be passed');
    }

    this.di = di;
    this.logger = di.getShared('logger');
    this.params = di.getShared('event').parameter;
  },

  execute: function execute() {
    this.di.getShared('controller').verifyToken(this.params.token);

    this.logger.info('call outgoing webhook handler');
    var output = this.handler(this.di, this.params);
    this.logger.info('output of outgoing webhook handler: ' + output);
    if (typeof output === 'string') {
      return {text: output};
    }

    return output;
  },

  getChannelId: function getChannelId() {
    return this.params.channel_id;
  }
};

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^registerOutgoingWebhook$" }] */
