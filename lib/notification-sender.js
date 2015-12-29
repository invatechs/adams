var config = require('./options').config;
var mailTemplates = require('./mail-templates');
var striptags = require('striptags');


String.prototype.replaceAll = function(search, replace) {
  return this.split(search).join(replace);
};


var sendNotification = function(notification, callback) {

  if(config !== null && config !== undefined && config.notifications !== null && config.notifications !== undefined) {

    var sender = require('sender-js');
    if(sender === undefined) {
      console.log('@sendNotification: Error: failed to initialize sender-js');
      return false;
    }
    if(!config.notifications.hasOwnProperty('senderJs')) {
      console.log('@sendNotification: Error: config.notifications doesn\'t have \"senderJs\" field.');
      return false;
    }
    sender.init(config.notifications.senderJs);

    var mailTemplate = 'Error occurred while parsing mail template.';
    if(notification.data !== null) {
      mailTemplate = mailTemplates[notification.status.toString()]
        .replaceAll('{{host}}', notification.data.host)
        .replaceAll('{{webHookPath}}', notification.data.webHookPath)
        .replaceAll('{{branch}}', notification.data.branch)
        .replaceAll('{{pusher}}', notification.data.pusher)
        .replaceAll('{{commitComment}}', notification.data.commitComment);
    }

    var date = new Date();
    var monthArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var time = date.getDate() + ' ' + monthArr[date.getMonth()] + ' ' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

    var message = {
      to: config.notifications.mailReceiver,
      from: config.notifications.mailSender !== null ? config.notifications.mailSender : 'adams@invatechs.com',
      subject: time + ' - "' + notification.data !== null ? !!notification.data.commitComment ? notification.data.commitComment : '' : 'no comment found' + '"',
      text: mailTemplate
    };

    if(config.notifications.senderJs !== undefined && config.notifications.senderJs !== null) {
      if(config.notifications.senderJs.slack !== undefined && config.notifications.senderJs.slack !== null) {
        message.slack = {
          to: config.notifications.senderJs.slack.channel,
          text: striptags(mailTemplate, ['b']).replaceAll(/<[^>]*>/, '*')
        };
      }
    }

    sender.send(message, function(err, message) {
      callback(err, message);
    });
  }
};
exports.sendNotification = sendNotification;