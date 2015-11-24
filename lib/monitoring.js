var monitoring = require('./options').monitoring;
var fs = require('fs');

String.prototype.replaceAll = function(find, replace_to) {
  return this.replace(new RegExp(find, "g"), replace_to);
};


/**
 * Replaces all string occurrences
 *
 * @function replaceAllMassive
 * @param obj
 * @returns {String}
 */
String.prototype.replaceAllMassive = function(obj) {
  var out = this;
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      out = out.replaceAll(key, obj[key]);
    }
  }
  return out;
};


/**
 * Reads project log, forms the page layout and sends it to the browser
 *
 * @function showProjectLog
 * @param {type} request
 * @param {type} response
 * @returns {undefined}
 */
function showProjectLog(request, response) {

  /**
   * Forms the HTML page with project log
   *
   * @function  makeHtmlPage
   * @param {type} project Project object with necessary data
   * @param {type} log Log data to show
   * @returns {string} HTML page to show
   */
  function makeHtmlPage(project, log) {
    var project = {
      '{{BACK_URL}}': '/' + monitoring.path,
      '{{PAGE_TITLE}}': project.alias,
      '{{TITLE}}': project.alias,
      '{{BODY}}': log
    };

    var htmlTemplate = fs.readFileSync(__dirname + '/templates/project_page.html', 'utf-8');
    htmlTemplate = htmlTemplate.replaceAllMassive(project);

    return htmlTemplate;
  }

  monitoring.projects.forEach(function(project) {
    if(typeof project.alias !== 'undefined' && project.alias === request.params.alias) {
      if(typeof project.logPath !== 'undefined') {

        fs.readFile(project.logPath, 'utf-8', function(err, data){
          if (!err) {
            var logHtml = makeHtmlPage(project, data);
            response.send(logHtml);
          } else {
            response.send('Error reading "options[].logPath" file');
          }
        });
      } else {
        response.send('Log file path not specified');
      }
    }
  });
}
exports.showProjectLog = showProjectLog;


/**
 * Shows the page with the list of projects
 *
 * @param {type} request
 * @param {type} response
 * @returns {undefined}
 */
function showProjectsPage(request, response) {

  var projectsList = '';
  if(!monitoring.projects || monitoring.projects.length === 0) {
    projectsList += '<p>There are no projects to monitor. Please check "config.json".</p>';
  } else {
    monitoring.projects.forEach(function(project) {
      if(typeof project.logPath !== 'undefined' && typeof project.alias !== 'undefined') {
        projectsList += '<a href="' + monitoring.path + '/' + project.alias + '">' + project.alias + '</a><br />';
      }
    });
  }

  var hooks = {
    '{{BODY}}': projectsList
  };
  var htmlTemplate = fs.readFileSync(__dirname + '/templates/projects.html', 'utf-8');
  htmlTemplate = htmlTemplate.replaceAllMassive(hooks);

  response.send(htmlTemplate);
}
exports.showProjectsPage = showProjectsPage;