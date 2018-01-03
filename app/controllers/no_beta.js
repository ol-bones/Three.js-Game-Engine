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

exports.no = function (req, res)
{
    res.render('layouts/default',
    {
	partials:
	{
	    head:"includes/head.html",
	    header: "includes/header.html",
	    content: "No",
	    footer: "includes/footer.html",
	    foot: "includes/foot.html"
	},
	User: req.user
    });
};



