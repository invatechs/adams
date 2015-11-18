var config = require('./options').config;
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());


function start(serverOptions) {

  /** Create listeners for POST requests for hooks from config.json
   *
   */
  var handleConfig = function() {

    if(config !== null || config !== undefined) {

      var isNotificationEnabled = config.notifications !== null && config.notifications !== undefined && Object.keys(config.notifications).length > 0;
      var requestHandler = require('./request-handler');
      var notificationParser = require('./notification-parser');

      config.projects.forEach(function(project) {

        app.post('/' + project.webhookPath, function(request, response) {

          try {
            var notification = {enable: isNotificationEnabled, data: null};

            if(isNotificationEnabled) {
              notification.data = notificationParser.retrieveNotificationData(request, project);
            }

            requestHandler.queueHook(project, notification);
            response.send('OK');

          } catch(e) {
            console.log('try error: ' + e + ' ; while setting webhook listener: ' + project.webhookPath);
            response.send('Catched error');
          }
        });
      });
    } else {
      console.log('Error: impossible handle config.json');
    }
  };
  handleConfig();

  app.listen(serverOptions.port);
}
exports.start = start;