/**
 * Retrieving information for further notification
 * @function checkHookAndGetNotificationData
 * @param {object} r - request, http request object
 * @param {object} p - project object from config.json
 * @returns {object} - notification object with data of with errors if such
 */
var checkHookAndGetNotificationData = function(r, p) {

  var d = {error: '@wrong header host name'};

  if(r.hasOwnProperty('headers') && r.headers['user-agent'] !== null) {

    var host = r.headers['user-agent'].match(/bitbucket/i) ? 'BitBucket' : r.headers['user-agent'].match(/github/i) ? 'GitHub' : null;
    if(host !== null) {

      if(!!r.body && !!r.body.repository) {

        if(p.webhookPath.match([r.body.repository.full_name])) {

          if(host === 'BitBucket' && p.gitBranch === r.body.push.changes[0].new.name) {

            return d = {
              host: host,
              branch: r.body.push.changes[0].new.name,
              pusher: r.body.actor.username,
              commitComment: r.body.push.changes[0].new.target.message
            };

          } else if(host === 'GitHub' && p.gitBranch === r.body.ref.substr(11,r.body.ref.length + 1)) {

            return d = {
              host: host,
              branch: r.body.ref.substr(11,r.body.ref.length + 1),
              pusher: r.body.commits[0].committer.username,
              commitComment: r.body.commits[0].message
            };

          } else {
            return d.error = '@: wrong branch name';
          }
        } else {
          return d.error = '@: wrong repository name';
        }
      } else {
        return d.error = '@: wrong data format';
      }
    }
  }
  return d;
};
exports.checkHookAndGetNotificationData = checkHookAndGetNotificationData;