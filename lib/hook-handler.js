var child_process = require('child_process');
var NodeGit = require("nodegit");


/**
 * Proceeding 5 stages:
 * 1) Creating 'tmp' directory if such doesn't exist;
 * 2) Removing previous project directory if such exist;
 * 3) Cloning repository (using 'nodegit' npm module);
 * 4) Installing dependencies (`npm install`);
 * 5) Starting deploy command (`npm run adams`).
 * @function handleHook
 * @param project
 * @param notificationSettings
 * @param callback
 * @return callback with error or null
 */
var handleHook = function(project, notificationSettings, callback) {

  var usernamePassword = project.username.length && project.password.length ? encodeURIComponent(project.username) + ':' + encodeURIComponent(project.password) + '@' : '';
  var gitCommand = project.git.substr(0, project.git.indexOf('://')) + '://' + usernamePassword + project.git.substr(project.git.indexOf('://') + 3, project.git.length - project.git.indexOf('://') + 3);
  var gitProjectName = gitCommand.substr(gitCommand.lastIndexOf('/') + 1).replace('.git', '');

  var cwdHookWorker = './';
  var cwdTemp = cwdHookWorker + '/' + 'tmp';
  var cwdProject = cwdTemp + '/' + gitProjectName;

  var notificationSender = require('./notification-sender');
  var notification = {status: 'error', data: notificationSettings.data};

  function sendNotification(status, message) {

    if(notificationSettings.enable) {
      notification.status = status;

      if (status === 'error') {
        notification.error = message;
      }

      notificationSender.sendNotification(notification, function(err, message) {
        if(!err) {
          console.log('@sendNotification: mail sent successfully: ' + message);
        } else {
          console.log('@sendNotification: error sending notification: ' + err);
        }
      });
    }
  };

  child_process.exec('mkdir ' + cwdTemp, {cwd: cwdHookWorker}, function () {

    child_process.exec('rm -rf ' + gitProjectName, {cwd: cwdTemp}, function () {

      var branch = project.gitBranch !== null && project.gitBranch.length > 0 ? project.gitBranch : '';
      var gitOptions = branch.length > 0 ? {checkoutBranch: branch} : {};

      NodeGit.Clone(gitCommand, cwdTemp + '/' + gitProjectName, gitOptions).then(function() {

        child_process.exec('npm install', {cwd: cwdProject}, function(errorNpmInstall) {

          if (errorNpmInstall !== null) {
            sendNotification('error', 'Error while "npm install" command. Watch log for more details.');
            callback(errorNpmInstall);

          } else {
            console.log('npm install success');
            child_process.exec('npm run adams', {cwd: cwdProject}, function (errorRunAdams) {

              if (errorRunAdams !== null) {
                sendNotification('error', 'Error while "npm run adams" command. Watch log for more details.');
                callback(errorRunAdams);

              } else {
                console.log('npm run adams success');
                sendNotification('success');
                callback(null);
              }
            });
          }
        });
      }).catch(function(error) {
        sendNotification('error', 'Error while cloning repository. Watch log for more details.');
        callback(error);
      });
    });
  });
};
exports.handleHook = handleHook;