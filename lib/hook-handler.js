var child_process = require('child_process');
var tempDirectory = require('./options').tempDirectory;
var fs = require('fs');

var logDate = function() {
  return ' [' + new Date() + ']';
};

/**
 * Proceeding 5 stages:
 * 1) Creating 'tmp' directory if such doesn't exist;
 * 2) Creating repository project directory if such doesn't exist;
 * 3) Downloading repository archive;
 * 4) Unzip project;
 * 5) Starting deploy command stack: `npm install`, `npm test` (if defined),
 `npm stop` (if `npm test` successfully passed or wasn't defined) and `npm start`.
 If in your `package.json` defined `scripts.adams` instead of commonly used stack
 of `npm` commands mentioned above would be run `npm adams`.
 * @function handleHook
 * @param project
 * @param notificationSettings
 * @param callback
 * @return callback with error or null
 */
var handleHook = function(project, notificationSettings, callback) {

  var branch = !!project.gitBranch ? project.gitBranch : 'master';
  var gitProjectName = project.git.substr(project.git.lastIndexOf('/') + 1).replace('.git', '');

  var isBitBucket = project.git.toLowerCase().match('bitbucket.org');
  var isGitHub = project.git.toLowerCase().match('github.com');

  var escape= function(s) {
    return s.replace(/[\/\\^$*+?.()|[\]{}]/g, '\\$&');
  };

  var userParams = '';
  if(!!project.username && !!project.password) {
    if (isBitBucket) {
      userParams = '--user ' + escape(project.username) + ':' + escape(project.password) + ' ';
    } else if(isGitHub) {
      userParams = '--user "' + escape(project.username) + ':' + escape(project.password) + '" ';
    }
  }

  var downloadArchive = '';
  var unZip = '';
  var ext = '';
  if(isBitBucket) {
    ext = '.tar.gz';
    downloadArchive = 'curl ' + userParams + project.git.replace('.git', '') + '/get/' + branch + ext + ' -o ' + branch + ext;
    //unZip = 'unzip -d '+branch+' '+branch+ext+' && f=('+branch+'/*) && mv '+branch+'/*/* '+branch+' && rm -rf "${f[@]}"';
    unZip = 'tar -xzf ' + branch + ext + ' -C ' + branch + ' --strip-components=1';
  } else if(isGitHub) {
    ext = '.tar.gz';
    downloadArchive = 'curl -sL ' + userParams + project.git.replace('.git', '') + '/tarball/' + branch + ' -o ' + branch + ext;
    unZip = 'tar -xzf ' + branch + ext + ' -C ' + branch + ' --strip-components=1';
  }



  var cwdAdams = './';
  var cwdTemp = tempDirectory !== null && tempDirectory !== '' ? tempDirectory : cwdAdams + 'tmp';

  var cwdProject = cwdTemp + '/' + gitProjectName;
  var cwdProjectBranch = cwdProject + '/' + branch;

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
          console.log('@sendNotification: mail sent successfully: ' + message + logDate());
        } else {
          console.log('@sendNotification: error sending notification: ' + err + logDate());
        }
      });
    }
  }


  /*if tempDirectory defined in config.json - pass creating it*/
  function createTempDirectoryNotDefined(callback) {

    if(tempDirectory !== null && tempDirectory !== '') {
      callback();
    } else {
      if (!fs.existsSync(cwdTemp)){
        fs.mkdirSync(cwdTemp);
        callback();
      } else {
        callback();
      }
    }
  }



  createTempDirectoryNotDefined(function() {
    /*make directory for current git project if such doesn't exist*/
    child_process.exec('mkdir ' + gitProjectName, {cwd: cwdTemp}, function () {

      /*remove previous project's archive and directory*/
      child_process.exec('rm -rf ' + branch + '; rm -rf ' + branch + ext, {cwd: cwdProject}, function () {

        /*download .tgz archive*/
        child_process.exec('mkdir ' + branch + ';' + downloadArchive, {cwd: cwdProject}, function (errorDownloadArchive) {

          if (errorDownloadArchive !== null) {
            sendNotification('error', 'Error while download git archive. Watch log for more details.');
            callback(errorDownloadArchive);

          } else {
            console.log('@download git archive success' + logDate());

            /*unZip project's archive*/
            child_process.exec(unZip, {cwd: cwdProject}, function (errorUnZip) {

              if (errorUnZip !== null) {
                sendNotification('error', 'Error while "unzipping" command. Watch log for more details.');
                callback(errorUnZip);

              } else {
                console.log('@unZip git archive success' + logDate());

                var checkNpmPropertyDefined = function(prop) {
                  var pckg = require('.' + cwdProjectBranch + '/package.json');
                  if(!!pckg) {
                    if(!!pckg.scripts) {
                      if(!!pckg.scripts[prop]) {
                        return true;
                      }
                    }
                  }
                  return false;
                };

                if(checkNpmPropertyDefined('adams')) {
                  /*commit 'npm run adams' command*/
                  child_process.exec('npm run adams', {cwd: cwdProjectBranch}, function (errorNpmRunAdams) {
                    if(errorNpmRunAdams !== null) {
                      sendNotification('error', 'Error while "npm run adams" command. Watch log for more details.');
                      callback(errorNpmRunAdams);

                    } else {
                      console.log('@npm run adams success' + logDate());
                      sendNotification('success');
                      callback(null);
                    }
                  });

                }
                else {
                  /*commit 'npm install' command*/
                  child_process.exec('npm install', {cwd: cwdProjectBranch}, function (errorNpmInstall) {

                    if (errorNpmInstall !== null) {
                      sendNotification('error', 'Error while "npm install" command. Watch log for more details.');
                      callback(errorNpmInstall);

                    } else {
                      console.log('@npm install success' + logDate());

                      /*check if `npm test` field defined in `package.json`*/
                      if(checkNpmPropertyDefined('test')) {
                        child_process.exec('npm test', {cwd: cwdProjectBranch}, function (errorNpmTest) {

                          if (errorNpmTest !== null) {
                            sendNotification('error', 'Error while "npm test" command. Watch log for more details.');
                            callback(errorNpmTest);

                          } else {
                            child_process.exec('npm stop', {cwd: cwdProjectBranch}, function (errorNpmStop) {

                              if (errorNpmStop !== null) {
                                sendNotification('error', 'Error while "npm stop" command. Watch log for more details.');
                                callback(errorNpmStop);

                              } else {
                                child_process.exec('npm start', {cwd: cwdProjectBranch}, function (errorNpmStart) {

                                  if (errorNpmStart !== null) {
                                    sendNotification('error', 'Error while "npm start" command. Watch log for more details.');
                                    callback(errorNpmStart);

                                  } else {
                                    console.log('@npm start success' + logDate());
                                    sendNotification('success');
                                    callback(null);

                                  }
                                });

                              }
                            });

                          }
                        });

                      } else {
                        child_process.exec('npm stop', {cwd: cwdProjectBranch}, function (errorNpmStop) {

                          if (errorNpmStop !== null) {
                            sendNotification('error', 'Error while "npm stop" command. Watch log for more details.');
                            callback(errorNpmStop);

                          } else {
                            child_process.exec('npm start', {cwd: cwdProjectBranch}, function (errorNpmStart) {

                              if (errorNpmStart !== null) {
                                sendNotification('error', 'Error while "npm start" command. Watch log for more details.');
                                callback(errorNpmStart);

                              } else {
                                console.log('@npm start success');
                                sendNotification('success');
                                callback(null);

                              }
                            });

                          }
                        });
                      }
                    }
                  });
                }
              }
            });
          }
        });
      });
    });
  });
};
exports.handleHook = handleHook;