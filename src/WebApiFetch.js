var WebApiFetch = function WebApiFetch(token) {
  this.token = token;
};

WebApiFetch.prototype.createApiUrl = function createApiUrl(apiMethod, httpMethod, params) {
  var url = 'https://slack.com/api/' + apiMethod;

  if (httpMethod === 'get') {
    url = url + this.createQueryString(params);
  }

  return url;
};

WebApiFetch.prototype.createFetchOptions = function createFetchOptions(httpMethod, params) {
  var options = {
    headers: {
      Authorization: 'Bearer ' + this.token
    },
    method: httpMethod === 'json' ? 'post' : httpMethod,
    muteHttpExceptions: true
  };

  if (httpMethod === 'json') {
    options.contentType = 'application/json; charset=utf-8';
    options.payload = JSON.stringify(params);
  } else if (httpMethod === 'post') {
    options.payload = params;
  }

  return options;
};

WebApiFetch.prototype.createRequestParams = function createRequestParams(params) {
  return Obj.merge({
    token: this.token
  }, params ? params : {});
};

WebApiFetch.prototype.createQueryString = function createQueryString(params) {
  return Object.keys(params).reduce(function reducer(queryString, key, i) {
    return queryString + (i === 0 ? '?' : '&') + encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
  }, '');
};

WebApiFetch.prototype.fetch = function fetch(apiMethod, httpMethod, params) {
  if (httpMethod !== 'get' && httpMethod !== 'json' && httpMethod !== 'post') {
    throw new Error('invalid HTTP method');
  }

  var reqParams = this.createRequestParams(params);
  var url = this.createApiUrl(apiMethod, httpMethod, reqParams);
  var fetchOpts = this.createFetchOptions(httpMethod, reqParams);
  return this.fetchUrl(url, fetchOpts);
};

WebApiFetch.prototype.fetchUrl = function fetchUrl(url, options) {
  this.error = null;
  this.result = null;

  try {
    this.response = UrlFetchApp.fetch(url, options);
  } catch (error) {
    this.error = error;
    return false;
  }

  if (this.response.getResponseCode() !== 200) {
    return false;
  }

  this.result = JSON.parse(this.response.getContentText());
  return this.result;
};
