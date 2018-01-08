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

exports.editor = function (req, res)
{
    res.render('layouts/default.html',
    {
	partials:
	{
	    head: "includes/play_head.html",
	    header: "includes/header.html",
	    entitytreeview: "editor/entitytreeview.html",
	    texturebrowser: "editor/texture_browser.html",
	    editor: "edit.html",
	    content: "play.html",
	    footer: "includes/footer.html",
	    foot: "includes/foot.html"
	},
	nav_edit: true,
	User: req.user,
	viewGlobals: req.viewGlobals
    });
};
