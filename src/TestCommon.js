var TestCommon = function TestCommon() {
  Bot.prototype.username = 'gasbot-test';
};

TestCommon.prototype.getProperty = function getProperty(key) {
  var properties = PropertiesService.getScriptProperties();
  return properties.getProperty('TEST_' + key);
};
