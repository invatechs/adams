var fs = require('fs');

var config = function() {
  var config;
  var configFile = null;
  if(process.argv[2] == '--projects') {
    configFile = process.argv[3];
  }
	
	if(configFile && fs.existsSync(configFile)) {
		config = require(configFile);
	} else {
		try {
			config = require('../config.local.json');
		} catch(e) {
			config = require('../config.json');
		}
	}
	return config;
};
exports.config = config();