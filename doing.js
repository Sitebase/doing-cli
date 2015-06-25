#!/usr/bin/env node
var TogglClient = require('toggl-api'),
    fs = require('fs'),
    projects = require('./projects.json'),
    replaces = require('./replaces.json');

var toggl = new TogglClient({apiToken: process.env.TOGGL_API_TOKEN})

if( ! process.env.TOGGL_API_TOKEN )
    return console.error('No environment variable TOGGL_API_TOKEN found');

var action = process.argv[2];
var project = process.argv[3];
var home = process.env.HOME || process.env.USERPROFILE;
var persist = home + '/.doing';


if( action != 'stop' && action != 'start' ) {
    project = action;
    action = 'start';
}

// correct short typos and short hand notations
if( replaces.hasOwnProperty(project) )
    project = replaces[project];

// validate project
if( action !== 'stop' && ! projects.hasOwnProperty(project) ) {
    console.error('project "%s" is not available', project);
    console.error('use:', Object.keys(projects).join(' | '));
    return;
}

if( action == 'start' ) {
    var projectID = projects[project];
    startTask(projectID, function() {
        console.log('started %s task', project);
    });
}

if( action == 'stop' ) {
    stopTask(function() {
        console.log('stopped task');
        toggl.destroy();
    });
}

function startTask( projectID, callback )
{
    toggl.startTimeEntry({
        description: '',
        tags: [project],
        billable:    true,
        pid: projectID
    }, function(err, timeEntry) {

        if( err )
            return console.error(err);

        var res = fs.writeFile(persist, timeEntry.id, function(err) {
            callback();
        });
    });
}

function stopTask(callback )
{
    var res = fs.readFile(persist, function(err, content) {

        if( err )
            return console.error(err);

        var timeEntryID = content.toString();
        toggl.stopTimeEntry(timeEntryID, function(err) {
            callback();
            fs.unlink(persist);
        });
    });
}
