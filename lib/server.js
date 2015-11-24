var config = require('./options').config;
var monitoring = require('./monitoring');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());


function start(serverOptions) {

  /** Create listeners for POST requests for hooks from config.json
   *
   */
  var loadConfig = function() {

    if(config !== null || config !== undefined) {

      var isNotificationEnabled = config.notifications !== null && config.notifications !== undefined && Object.keys(config.notifications).length > 0;
      var requestHandler = require('./request-handler');
      var requestParser = require('./request-parser');

      config.projects.forEach(function(project) {

        app.post('/' + project.webhookPath, function(request, response) {

          try {

            var notificationData = requestParser.checkHookAndGetNotificationData(request, project);

            if(notificationData.hasOwnProperty('error')) {

              console.log('try error: ' + notificationData.error + ' ; while setting webhook listener: ' + project.webhookPath);
              response.send('Caught error parsing hook');

            } else {

              var notification = {enable: isNotificationEnabled, data: notificationData};
              requestHandler.queueHook(project, notification);
              response.send('OK');

            }
          } catch(e) {
            console.log('try error: ' + e + ' ; while setting webhook listener: ' + project.webhookPath);
            response.send('Caught error');
          }
        });
      });

      if(!!config.monitoring && !!config.monitoring.path) {
        app.get('/' + config.monitoring.path, monitoring.showProjectsPage);
        app.get('/' + config.monitoring.path + '/:alias', monitoring.showProjectLog);
      }


    } else {
      console.log('Error: impossible load config.json');
    }
  };
  loadConfig();

  app.listen(serverOptions.port);
}
exports.start = start;