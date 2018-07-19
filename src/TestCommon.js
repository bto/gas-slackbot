var TestCommon = function TestCommon() {
};

TestCommon.prototype.getProperty = function getProperty(key) {
  var properties = PropertiesService.getUserProperties();
  return properties.getProperty('TEST_' + key);
};
