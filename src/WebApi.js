var WebApi = function WebApi(token) {
  this.token = token;
};

WebApi.prototype.chatPostMessage = function chatPostMessage(channelId, message, params) {
  return this._fetch('chat.postMessage', 'json', Obj.merge({
    channel: channelId,
    text: message
  }, params ? params : {}));
};

WebApi.prototype._fetch = function _fetch(apiMethod, httpMethod, params) {
  return (new WebApiFetch(this.token)).fetch(apiMethod, httpMethod, params);
};
