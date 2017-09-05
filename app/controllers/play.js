'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const { wrap: async } = require('co');
const only = require('only');
const { respond, respondOrRedirect } = require('../utils');


const request = require('request');

const assign = Object.assign;

exports.play = function (req, res)
{
    console.log(req.viewGlobals);
    res.render('play', {viewGlobals: req.viewGlobals});
};
