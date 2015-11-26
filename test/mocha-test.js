var assert = require('assert');
//var adams = require('../adams.js');
var child_process = require('child_process');
var request = require('request');
var path = require("path");
var adamsStarted = false;

child_process.exec("ps -ef | grep ./adams.js | grep -v grep | awk '{ print $2 }'", function(err, data) {
			if (err) {
				console.log(err, data);
			} else {
        if(data.length === 0) {
          var adamsPath = 'sh ' + path.resolve(__dirname, '../start.sh');
          child_process.exec(adamsPath, {}, function(err, stdout, stderr){
            if(!err) {
              adamsStarted = true;
            }
          });
        }
      }
		});

var config = {};

try {
  config = require('../config.local.json');
} catch(e) {
  config = require('../config.json');
}


var bitBucketTestBody = {
  "push": {
    "changes": [
      {
        "new": {
          "name": "master",
          "target": {
            "message": "Adams test commit message"
          }
        }
      }
    ]
  },
  "repository": {
    "full_name": "invatechs/adams"
  },
  "actor": {
    "username": "AdamsTestUser"
  }
};

var gitHubTestBody = {
  "ref": "refs/heads/master",
  "repository": {
    "full_name": "invatechs/adams",
  },
  "commits": [
    {
      "message": "Adams test commit message",
      "committer": {
        "username": "AdamsTestUser"
      }
    }
  ]
};



//module.exports = {
//  before: function (done) {
//    setTimeout(done, 1000);
//  },
//
//  'Test config.json: should find and load config.json file': function (done) {
//    assert.notEqual(config, null);
//    done();
//  },
//  'Test config.json: should find "adams" field in config file': function (done) {
//    assert.notEqual(config.adams, null);
//    done();
//  },
//
//  'Test server connection BitBucket: should return a response.statusCode 200': function (done) {
//
//    var protocol = 'http';
//    var uri = protocol + '://' + config.adams.host + ':' + config.adams.port + '/' + config.projects[0].webhookPath;
//    var body = JSON.stringify(bitBucketTestBody);
//
//    request({
//      uri: uri,
//      method: 'POST',
//      headers: {
//        "user-agent": "bitbucket"
//      },
//      body: body
//
//    }, function(error, response) {
//
//      if(error) throw new Error(error);
//      assert.equal(response.statusCode, 200);
//      done();
//
//    });
//  },
//  'Test server connection GitHub: should return a response.statusCode 200': function (done) {
//
//    var protocol = 'http';
//    var uri = protocol + '://' + config.adams.host + ':' + config.adams.port + '/' + config.projects[0].webhookPath;
//    var body = JSON.stringify(gitHubTestBody);
//
//    request({
//      uri: uri,
//      method: 'POST',
//      headers: {
//        "user-agent": "github"
//      },
//      body: body
//
//    }, function(error, response) {
//
//      if(error) throw new Error(error);
//      assert.equal(response.statusCode, 200);
//      done();
//
//    });
//  }
//};

//module.exports =  function() {
beforeEach(function (done) {
  setTimeout(done, 1000);
});

after(function(done){
  if(adamsStarted) {
    var adamsStop = "sh " + path.resolve(__dirname, '../stop.sh');
    child_process.exec(adamsStop);
    console.log("Test finised, ADAMS test server has been stopped");
  }
  done();
});

describe("Test config.json", function() {

  it('Should find and load config.json file', function (done) {
    assert.notEqual(config, null);
    done();
  });
  it('Should find "adams" field in config file', function (done) {
    assert.notEqual(config.adams, null);
    done();
  });
});

describe('Test server connection', function() {
  describe('BitBucket', function() {
    it('Should return a response.statusCode 200', function (done) {

      var protocol = 'http';
      var uri = protocol + '://' + config.adams.host + ':' + config.adams.port + '/' + config.projects[0].webhookPath;
      var body = JSON.stringify(bitBucketTestBody);

      request({
        uri: uri,
        method: 'POST',
        headers: {
          "user-agent": "bitbucket"
        },
        body: body

      }, function(error, response) {

        if(error) throw new Error(error);
        assert.equal(response.statusCode, 200);
        done();

      });
    });
  });

  describe('GitHub', function() {
    it('Should return a response.statusCode 200', function (done) {

      var protocol = 'http';
      var uri = protocol + '://' + config.adams.host + ':' + config.adams.port + '/' + config.projects[0].webhookPath;
      var body = JSON.stringify(gitHubTestBody);

      request({
        uri: uri,
        method: 'POST',
        headers: {
          "user-agent": "github"
        },
        body: body

      }, function(error, response) {

        if(error) throw new Error(error);
        assert.equal(response.statusCode, 200);
        done();
      });
    });
  });
});
//};