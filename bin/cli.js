#! /usr/bin/env node

'use strict'

var fs = require("fs");
var path = require("path");
var program = require('commander');
var child_process = require('child_process');
var spawn = require('win-spawn');
var running = require('is-running');

program
    .version("0.0.1")
    .option('-p, --projects [projectsFile]', 'Path to projects file')
    .option('stop', 'Stop the application')
    .option('-l, --log [logFile]', 'Path to log file')
    .parse(process.argv);

var pid = 0;
if(fs.existsSync(path.resolve(__dirname, 'cli.pid'))) {	// Process ID file is found
		// Check for active app process
		pid = parseInt(fs.readFileSync(path.resolve(__dirname, 'cli.pid')));
}

if(!program.stop) {
	if(pid && running(pid))	{
		console.log('ADAMS service is already running');
	} else {
		var appCommand = path.resolve(__dirname, '../adams.js');

		var appArgs = [appCommand];

		// There is a projects argument
		if(program.projects && fs.existsSync(program.projects)) {
			appArgs.push('--projects');
			appArgs.push(program.projects);
		}

		var spawnOptions = { 
						detached: true, 
						stdio: [ 'ignore', 'pipe', 'pipe'],
						cwd: path.resolve(__dirname, "../")
		};
    
    // Log file is specified
		var logFile = '/dev/null';
		if(program.log) {
			logFile = path.resolve(__dirname, '../' + program.log);
		}
    
    var out = fs.openSync(logFile, 'a');
    var err = fs.openSync(logFile, 'a');
    spawnOptions.stdio = [ 'ignore', out, err];

    var child = spawn('node', appArgs, spawnOptions);

    if(child.pid) {
      fs.writeFileSync(path.resolve(__dirname, 'cli.pid'), child.pid, "utf-8");
    }

		child.unref();
    process.exit();
	}
} else {
	if(pid) {   
		child_process.exec("kill " + pid, function(err, data) {
			if (err) {
				console.log(err, data);
			}
			else {
				console.log("Stopped daemon with PID %s", pid);
			}
		});
	}
}