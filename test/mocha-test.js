var assert = require('assert');
var request = require('request');
var child_process = require('child_process');
var path = require('path');
var adamsStarted = false;


/**
 * Search for adams working server and if there is one - pass starting new one for testing;
 * Otherwise starts new adams server using `start.sh` script and remember to stop it after
 * all tests finished;
 */
var getAdamsServerForTests = function(callback) {
  child_process.exec("ps -ef | grep ./adams.js | grep -v grep | awk '{ print $2 }'", function(err, data) {
    if (err) {
      console.log(err, data);
    } else {
      if (data.length === 0) {
        var adamsPath = 'sh ' + path.resolve(__dirname, '../start.sh');
        child_process.exec(adamsPath, {}, function (err) {
          if (!err) {
            adamsStarted = true;
            console.log('ADAMS server: started new test server');
            callback();
          }
        });
      } else {
        console.log('ADAMS server: using existing running server');
        callback();
      }
    }
  });
};


/**
 * Retrieves `config.json` file;
 */
var config = {};
try {
  config = require('../config.local.json');
} catch(e) {
  config = require('../config.json');
}


/**
 * Creating object to use it as request.body for test POST request;
 * The object consists of the minimum required set of fields for detecting
 * that is BitBucket-like webhook POST request;
 * @type {{push: {changes: *[]}, repository: {full_name: string}, actor: {username: string}}}
 */
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


/**
 * Creating object to use it as request.body for test POST request;
 * The object consists of the minimum required set of fields for detecting
 * that is GitHub-like webhook POST request;
 * @type {{ref: string, repository: {full_name: string}, commits: *[]}}
 */
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


/**
 * Add
 */
beforeEach(function (done) {
  setTimeout(done, 1000);
});


/**
 * After all tests finished or after fail of any of them -
 * if a new ADAMS server has been started for testing - stop it;
 * If there has been used other ADAMS server for testing - do nothing;
 */
after(function(done){
  if(adamsStarted) {
    var adamsStop = "sh " + path.resolve(__dirname, '../stop.sh');
    child_process.exec(adamsStop);
    console.log("Tests finished, ADAMS test server has been stopped");
  }
  done();
});

/**
 * Test config file;
 */
describe("Test config.json", function() {

  it('Should find and load config.json file', function (done) {
    assert.notEqual(config, null);
    done();
  });
  it('Should find "adams" field in config file', function (done) {
    assert.notEqual(config.adams, null);
    done();
  });
  it('Start test server', function(done) {
    getAdamsServerForTests(done);
  });
});


/**
 * Test POST requests with preset BitBucket and GitHub params;
 */
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
        },
        function(error, response) {
          if (error) throw new Error(error);
          assert.equal(response.statusCode, 200);
          done();
        });
    });
  });
});