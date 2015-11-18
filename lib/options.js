var config = function() {
  var config;
  try {
    config = require('../config.local.json');
  } catch(e) {
    config = require('../config.json');
  }
  return config;
};
exports.config = config();