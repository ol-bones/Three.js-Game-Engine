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

// client js
clientJSFiles = glob.sync(join(__dirname, "/public/js/**/*.js"))
    .map((file) => file.replace(__dirname + "/public", ""));

let viewGlobals = {};
viewGlobals.clientJSFiles = clientJSFiles;
console.log(viewGlobals);

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
