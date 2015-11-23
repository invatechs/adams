var assert = require('assert');
var adams = require('../adams.js');
var request = require('request');

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

describe("Test config.json", function() {

  it('Should find and load config.json file', function () {
    assert.notEqual(config, null);
  });
  it('Should find "adams" field in config file', function () {
    assert.notEqual(config.adams, null);
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