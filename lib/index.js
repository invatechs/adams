var config = require('./options').config;
var cluster = require('cluster');
var numCPUs = 1;// require('os').cpus().length;


if (cluster.isMaster) {

  cluster.on('exit', function(worker, code, signal) {
    cluster.fork();
    console.log('ADAMS worker (pid = ' + worker.process.pid + ') died. New forked.');
  });

  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

} else if(cluster.isWorker) {

  var server = require('./server');
  server.start({port:config.adams.port});
  console.log('server started: ' + new Date());
}