var TestCommon = function TestCommon() {
  this.initialize();
};

TestCommon.prototype = {
  initialize: function initialize() {
  },

  createDI: function createDI(params, eventParams) {
    var di = SlackBot.Controller.prototype.createDI();

    di.set('controller', function service(diObj) {
      var common = new TestCommon();
      var controller = new SlackBot.Controller(diObj);
      controller.setBotAccessToken(common.getProperty('SLACK_BOT_ACCESS_TOKEN'));
      return controller;
    });

    di.setShared('config', {
      channelId: this.getProperty('SLACK_CHANNEL_ID'),
      verificationToken: this.getProperty('SLACK_VERIFICATION_TOKEN')
    });
    di.setShared('event', this.createEvent(params, eventParams));

    return di;
  },

  createEvent: function createEvent(params, eventParams) {
    var channelId = this.getProperty('SLACK_CHANNEL_ID');
    var token = this.getProperty('SLACK_VERIFICATION_TOKEN');

    var parameter = SlackBot.Obj.merge({
      token: token
    }, params ? params : {});

    var postData = SlackBot.Obj.merge({
      challenge: 'challenge code',
      event: SlackBot.Obj.merge({
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
