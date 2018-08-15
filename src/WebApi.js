var WebApi = function WebApi(token) {
  this.token = token;
};

WebApi.prototype.callChatPostMessage = function callChatPostMessage(channelId, message, params) {
  params.channel = channelId;
  params.text = message;
  return this._fetch('chat.postMessage', 'post', params, {json: true});
};

WebApi.prototype._createApiUrl = function _createApiUrl(method) {
  return 'https://slack.com/api/' + method;
};

WebApi.prototype._createFetchOptions = function _createFetchOptions(httpMethod, params, json) {
  var options = {
    headers: {
      Authorization: 'Bearer ' + this.token
    },
    method: httpMethod,
    muteHttpExceptions: true
  };

  if (httpMethod === 'post') {
    if (json) {
      options.payload = JSON.stringify(params);
    } else {
      options.payload = params;
    }
  }

  return options;
};

WebApi.prototype._createFetchParams = function _createFetchParams(params) {
  params.token = this.token;
  return params;
};

WebApi.prototype._fetch = function _fetch(method, httpMethod, params, options) {
  if (httpMethod === 'get') {
    throw new Error('HTTP GET method is currently not supported');
  }

  if (httpMethod !== 'post') {
    throw new Error('invalid HTTP method');
  }

  var url = this._createApiUrl(method);
  var opts = this._createFetchOptions(httpMethod, this._createFetchParams(params), options.json);
  return this._fetchUrl(url, opts);
};

WebApi.prototype._fetchUrl = function _fetchUrl(url, options) {
  try {
    var response = UrlFetchApp.fetch(url, options);
  } catch (error) {
    return {
      ok: false,
      error: error.toString()
    };
  }

  if (response.getResponseCode() !== 200) {
    return {
      ok: false,
      error: 'HTTP status code was not 200',
      contents: response.getContentText()
    };
  }

  return JSON.parse(response.getContentText());
};
