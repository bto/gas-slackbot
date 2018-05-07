var PluginTenki = gasbot.plugins.tenki = function PluginTenki() {
};

PluginTenki.prototype.exec = function exec() {
  var properties = PropertiesService.getScriptProperties();
  var clientId = properties.getProperty('YAHOO_CLIENT_ID');

  var coodinates = '139.732293,35.663613';

  var url = 'https://map.yahooapis.jp/weather/V1/place?appid=' + clientId +
    '&coordinates=' + coodinates +
    '&output=json&interval=5';
  var urlFetchOption = {
    'method': 'get',
    'contentType': 'application/json; charset=utf-8',
    'muteHttpExceptions': true
  };
  var response = UrlFetchApp.fetch(url, urlFetchOption);
  var json = JSON.parse(response.getContentText());

  var message = '```\n降水強度\n';
  var items = json.Feature[0].Property.WeatherList.Weather;
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    message += i * 5 + '分後: ' + item.Rainfall + 'mm/h\n';
  }
  message += '```\n';
  (new Slack()).send(message);
};
