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
    res.render('layouts/default.html',
    {
	partials:
	{
	    head: "includes/play_head.html",
	    header: "includes/header.html",
	    content: "play.html",
	    footer: "includes/footer.html",
	    foot: "includes/foot.html"
	},
	nav_play: true,
	User: req.user,
	viewGlobals: req.viewGlobals
    });
};
