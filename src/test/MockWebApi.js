SlackBot.MockWebApi = function MockWebApi() {
  this.initialize.apply(this, arguments);
};

SlackBot.Class.extend(SlackBot.MockWebApi, SlackBot.WebApi, {
  call: function call(apiMethod, httpMethod, params) {
    return SlackBot.MockWebApi._super(arguments).call(this, 'api.test', httpMethod, params);
  }
});
