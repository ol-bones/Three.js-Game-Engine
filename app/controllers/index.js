'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const { wrap: async } = require('co');
const only = require('only');
const { respond, respondOrRedirect } = require('../utils');

const assign = Object.assign;

exports.index = function (req, res)
{
    res.render("layouts/default.html",
    {
	partials:
	{
	    head: "includes/head.html",
	    header: "includes/header.html",
	    content: "index.html",
	    footer: "includes/footer.html",
	    foot: "includes/foot.html"
	},
	nav_home: true,
	User: req.user,
	viewGlobals: req.viewGlobals
    });
};


