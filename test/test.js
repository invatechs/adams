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

setTimeout(function() {
  var request = require('request');
  var address = 'http://localhost:7895/invatechs/adams';
  var b = JSON.stringify('{"test":"json"}');
  request({
    uri: address,
    method: 'POST',
    headers: {
      "user-agent": "github"
    },
    body: b
  }, function(error, response, body){
    console.log('------- error: ' + error);
    console.log('------- response: ' + JSON.stringify(response));
    console.log('------- body: ' + JSON.stringify(body));
  });
}, 1000);