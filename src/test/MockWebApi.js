function MockWebApi() {
  this.initialize.apply(this, arguments);
}

Class.extend(MockWebApi, WebApi, {
  call: function call(apiMethod, httpMethod, params) {
    return MockWebApi._super(arguments).call(this, 'api.test', httpMethod, params);
  }
});
