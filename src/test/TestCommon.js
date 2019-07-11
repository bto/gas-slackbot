var TestCommon = function TestCommon() {
  this.initialize();
};

TestCommon.prototype = {
  initialize: function initialize() {
  },

  createController: function createController(params, eventParams) {
    var controller = new Controller(this.createEvent(params, eventParams));
    controller.setBotAccessToken(this.getProperty('SLACK_BOT_ACCESS_TOKEN'));
    controller.setVerificationToken(this.getProperty('SLACK_VERIFICATION_TOKEN'));
    return controller;
  },

  createEvent: function createEvent(params, eventParams) {
    var channelId = this.getProperty('SLACK_CHANNEL_ID');
    var token = this.getProperty('SLACK_VERIFICATION_TOKEN');

    var parameter = Obj.merge({
      token: token
    }, params ? params : {});

    var postData = Obj.merge({
      challenge: 'challenge code',
      event: Obj.merge({
        channel: channelId,
        type: 'app_mention'
      }, eventParams ? eventParams : {}),
      token: token,
      type: 'event_callback'
    }, params ? params : {});

    return {
      parameter: parameter,
      postData: {
        contents: JSON.stringify(postData)
      }
    };
  },

  getProperty: function getProperty(key) {
    var properties = PropertiesService.getScriptProperties();
    return properties.getProperty('TEST_' + key);
  }
};
