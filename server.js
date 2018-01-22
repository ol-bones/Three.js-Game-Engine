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

let geom_models = [];
let textures = [];
let texturespng = glob.sync(join(__dirname, "public/textures/**/*.png"));
let texturesjpg = glob.sync(join(__dirname, "public/textures/**/*.jpg"));

let modelsobj = glob.sync(join(__dirname, "public/models/**/*.obj"));

// client js
clientJSFiles = glob.sync(join(__dirname, "/public/js/**/*.js"))
    .concat(whiskerTemplates)
    .concat(texturespng)
    .concat(texturesjpg)
    .concat(modelsobj)
    .map((file) =>
    {
	whiskerTemplates = [];
	textures = [];
	geom_models = [];

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

	if(file.search(".png") > -1)
	{
	    extensionIndex = file.lastIndexOf(".png");
	}

	if(file.search(".jpg") > -1)
	{
	    extensionIndex = file.lastIndexOf(".jpg");
	}

	if(file.search(".obj") > -1)
	{
	    extensionIndex = file.lastIndexOf(".obj");
	}

	let extension = file.substring(extensionIndex, file.length);
	let fileName = file.substring(file.lastIndexOf("/")+1, extensionIndex);
	let fileString = fs.readFileSync(file).toString();
	let dependencyStrings = [];

	if(fileName !== "whiskers")
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
	    ext: extension,
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
	if(file.path.includes("/textures"))
	{
	    textures.push(
	    {
		name: file.name,
		ext: file.ext,
		path: file.path.replace("textures/","")
	    });

	    return;
	}
	if(file.path.includes("/models") && !file.path.includes("/js/"))
	{
	    geom_models.push(
	    {
		name: file.name,
		ext: file.ext,
		path: file.path
	    });

	    return;
	}

	if(file.path.includes("/views")) { whiskerTemplates.push(file); return; }
	if(!file.dependencies || file.name === "whiskers") { graph.push([file]); return; }

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

let client_config = JSON.parse(fs.readFileSync(__dirname + "/public/js/config/config.json", "utf8"));

var viewGlobals = {};
viewGlobals.editorJSFiles = clientJSFiles.filter(js => js.path.includes("/editor/"));
viewGlobals.clientJSFiles = clientJSFiles.filter(js => !js.path.includes("/editor/"));
viewGlobals.externalJSFiles = externalJSFiles;
viewGlobals.navbardropdowns = JSON.parse(fs.readFileSync(__dirname +
"/app/views/editor/toolbar/NavbarDropdowns.json", "utf8"));

app.componentTypes = componentTypes;
app.whiskerTemplates = whiskerTemplates;
app.textures = textures;
app.models = geom_models;
app.client_config = client_config;

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
