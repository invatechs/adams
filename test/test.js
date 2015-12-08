var child_process = require('child_process');
var request = require('request');

child_process.exec('sh start.sh', {cwd: '..'}, function(err, stdout, stderr) {
  if (err !== null) {
    console.log(new Date() + ' stderr: ' + stderr);
    console.log('exec err: ' + err);
  } else {
    console.log('successed connected');
  }
});



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

setTimeout(function() {
  var request = require('request');
  var address = 'http://localhost:7895/invatechs/adams';
  var b = JSON.stringify(gitHubTestBody);
  request({
    uri: address,
    method: 'POST',
    headers: {
      "user-agent": "github",
      "content-type": "application/json"
    },
    body: b
  }, function(error, response, body){
    if(error) throw new Error(error);
    console.log('Test request to GitHub: response.statusCode ' + response.statusCode + '; response.body:' + JSON.stringify(body));
  });
}, 1000);