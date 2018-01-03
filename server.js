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
const port = process.env.PORT || 80;
const app = express();


const glob = require("glob")

const toposort = require("toposort")

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

let allFiles = [];
let clientJSFiles = [];
let externalJSFiles = [];
let componentTypes = [];
let whiskerTemplates = glob.sync(join(__dirname, "public/js/**/*.whtml"));

// client js
clientJSFiles = glob.sync(join(__dirname, "/public/js/**/*.js"))
    .concat(whiskerTemplates)
    .map((file) =>
    {
	whiskerTemplates = [];

	let extensionIndex = 0;
	if(file.search(".js") > -1)
	{
	    extensionIndex = file.lastIndexOf(".js")
	    console.log("INDEX: " + extensionIndex);
	}

	if(file.search(".whtml") > -1)
	{
	    extensionIndex = file.lastIndexOf(".whtml");
	    console.log("INDEX: " + extensionIndex);
	}

	let fileName = file.substring(file.lastIndexOf("/")+1, extensionIndex);
	let fileString = fs.readFileSync(file).toString();
	let dependencyStrings = [];

	if(!file.includes("/libs/"))
	{
	    let re = /@(.*)@/g;
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

	if(file.includes("/entity/components/"))
	{
	    componentTypes.push(fileName);
	}

	let parsed =
	{
	    name: fileName,
	    path: file.replace(__dirname + "/public", ""),
	    contents: fileString,
	    dependencies: dependencyStrings
	};
	return parsed;
    });

    let graph = [];
    let libs = [];

    clientJSFiles.forEach(file =>
    {
	if(file.path.includes("/lib")) { libs.push(file); return; }
	if(file.path.includes("/views")) { whiskerTemplates.push(file); return; }
	if(!file.dependencies) { graph.push([file]); return; }

	file.dependencies.forEach(d => graph.push([file, clientJSFiles.find(f => f.name === d)]));
    });

    clientJSFiles = libs.concat(toposort(graph).filter(f=>f).reverse());

    clientJSFiles.forEach((file, index, array) =>
    {
	console.log(index, " | +  ", file.name);
	if(file.dependencies)
	{
	    file.dependencies.forEach((dep) => console.log("     |  - " + dep));
	}
    });

    console.log("---- CLIENT WHISKER TEMPLATES ----");
    whiskerTemplates.forEach((file) =>
    {
	console.log(file.name);
    });

externalJSFiles = JSON.parse(fs.readFileSync(__dirname + '/public/js/config/external_cdn_libs.json', 'utf8'));


var viewGlobals = {};
viewGlobals.editorJSFiles = clientJSFiles.filter(js => js.path.includes("/editor/"));
viewGlobals.clientJSFiles = clientJSFiles.filter(js => !js.path.includes("/editor/"));
viewGlobals.externalJSFiles = externalJSFiles;

app.componentTypes = componentTypes;
app.whiskerTemplates = whiskerTemplates.map(file => file.name);

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
