var fs = require('fs');

var config = function() {
  var config = null;
  var configFile = null;
  if(process.argv[2] === '--projects') {
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


var monitoring = function() {
	var c = config();
	if(c.hasOwnProperty('monitoring')) {
		var m = c.monitoring;
		if(m.hasOwnProperty('path')) {
			return m;
		}
	}
	return null;
};
exports.monitoring = monitoring();


var tempDirectory = function() {
	var c = config();
	if(c.hasOwnProperty('tempDirectory')) {
		return c.tempDirectory;
	}
	return null;
};
exports.tempDirectory = tempDirectory();


function validateTempDirectory() {
	var td = tempDirectory();
	console.log(td);
	if(!(td === null || td === '')) {
		fs.accessSync(td, fs.W_OK);
	}
}
exports.validateTempDirectory = validateTempDirectory;