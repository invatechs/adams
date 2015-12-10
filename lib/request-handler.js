var hookHandler = require('./hook-handler');
var queue = [];
var queueIsWaiting = false;


/**
 * Push new hook object to queue
 * @function queueHook
 * @param project
 * @param notificationSettings
 */
var queueHook = function(project, notificationSettings) {
  queue.push({project: project, notificationSettings: notificationSettings});
};
exports.queueHook = queueHook;


/**
 * Periodically check if there is any object in queue and proceed task if so
 * @function proceedQueue
 */
function proceedQueue() {

  var task = queue.shift();
  if(task) {

    if(task.hasOwnProperty('project')) {

      queueIsWaiting = true;
      hookHandler.handleHook(task.project, task.hasOwnProperty('notificationSettings') ? task.notificationSettings : null, function(err) {

        queueIsWaiting = false;

        if(err !== null) {
          console.log('@handleHook callback: ' + err);
          //console.log('Error occured while proceeding task: ' + err);
        } else {
          console.log('@handleHook callback: SUCCESS');
        }

      });
    }
  }
}


/**
 * Setting interval to process tasks queue
 */
setInterval(function() {

  if(!queueIsWaiting) {
    proceedQueue();
  }

}, 5000);