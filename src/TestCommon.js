var TestCommon = function TestCommon() {
};

TestCommon.prototype.getProperty = function getProperty(key) {
  var properties = PropertiesService.getScriptProperties();
  return properties.getProperty('TEST_' + key);
};
