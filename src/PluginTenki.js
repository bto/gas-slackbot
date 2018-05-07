var PluginTenki = function PluginTenki() {
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

  var rainFall = json.Feature[0].Property.WeatherList.Weather[0].Rainfall;
  (new Slack()).send('降水強度: ' + rainFall + 'mm/h');
};
