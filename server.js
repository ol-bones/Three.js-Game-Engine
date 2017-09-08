'use strict';
console.log("[INFO] -- Server launching...");

/*
 * nodejs-express-mongoose-demo
 * Copyright(c) 2013 Madhusudhan Srinivasa <madhums8@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies
 */

console.log("[INFO] -- Loading node modules");

require('dotenv').config();

const fs = require('fs');
const join = require('path').join;
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const config = require('./config');

const models = join(__dirname, 'app/models');
const port = process.env.PORT || 5000;
const app = express();


const glob = require("glob")


console.log("[INFO] -- Express loading");

/**
 * Expose
 */

module.exports = app;

console.log("");
console.log("");

console.log("[INFO] -- Server started");

// Bootstrap models
fs.readdirSync(models)
    .filter(file => ~file.search(/^[^\.].*\.js$/))
    .forEach(file => require(join(models, file)));

var allFiles = [];
var clientJSFiles = [];
var externalJSFiles = [];

var curDir = "";
function sortByDir(a, b)
{
    if(a.includes(curDir)) 
    {
	return 1;
    }
    else
    {
	return 0;
    }
}

// client js
clientJSFiles = glob.sync(join(__dirname, "/public/js/**/*.js"))
    .map((file) =>
    {
	var fileString = fs.readFileSync(file).toString();
	var dependencyStrings = [];

	if(!file.includes("/libs/"))
	{
	    var re = /@(.*)@/g;
	    dependencyStrings = (fileString.match(re));
	}

	if(dependencyStrings && dependencyStrings.length > 0)
	{
	    dependencyStrings = dependencyStrings.map(
		(string) =>
		    string.replace("@","")
		    .replace("@", "")
	    );
	}
	var parsed = 
	{
	    name: file.substring(file.lastIndexOf("/")+1, file.lastIndexOf(".js")),
	    path: file.replace(__dirname + "/public", ""),
	    contents: fileString,
	    dependencies: dependencyStrings
	};
	console.log(parsed.name, " ", parsed.dependencies);
	return parsed;
    });

    console.log("- - - - -  -");
    clientJSFiles.sort((a,b) =>
    {
        if(b.dependencies && b.dependencies.length > 0)
	{
	    if([a.name].includes(b.dependencies))
	    {
		return 1;
	    }
	    else
	    {
		return -1;
	    }
	}
	else if(a.path.includes("/libs/"))
	{
	    return -1;
	}
	return 1;
    })
    .forEach((file, index, array) =>
    {
	console.log(index, " |  ", file.name);
	if(file.dependencies)
	{
	    file.dependencies.forEach((dep) => console.log("    | - " + dep));
	}
    });

externalJSFiles = JSON.parse(fs.readFileSync(__dirname + '/public/js/config/external_cdn_libs.json', 'utf8'));


var viewGlobals = {};
viewGlobals.clientJSFiles = clientJSFiles;
viewGlobals.externalJSFiles = externalJSFiles;

console.log("[INFO] -- Opening route endpoints");

// Bootstrap routes
require('./config/passport')(passport);
require('./config/express')(app, passport);
require('./config/routes')(app, passport, viewGlobals);



connect()
    .on('error', console.log)
    .on('disconnected', connect)
    .once('open', listen);

function listen ()
{
    if (app.get('env') === 'test') { return };
    app.listen(port);
    console.log('[INFO] -- Server listening on *:' + port);
}

function connect ()
{
    var options = { server: { socketOptions: { keepAlive: 1 } } };
    return mongoose.connect(config.db, options).connection;
}