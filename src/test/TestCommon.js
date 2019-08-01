var TestCommon = function TestCommon() {
  this.initialize();
};

TestCommon.prototype = {
  initialize: function initialize() {
  },

  createDI: function createDI(params, eventParams) {
    var di = Controller.prototype.createDI();

    di.set('webApi', function service(diObj) {
      return new MockWebApi(diObj.getShared('config').botAccessToken);
    });

    di.setShared('config', {
      botAccessToken: this.getProperty('SLACK_BOT_ACCESS_TOKEN'),
      channelId: this.getProperty('SLACK_CHANNEL_ID'),
      verificationToken: this.getProperty('SLACK_VERIFICATION_TOKEN')
    });
    di.setShared('event', this.createEvent(params, eventParams));
    di.setShared('logger', new Log());

    di.setShared('controller', new Controller(di));

    return di;
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
