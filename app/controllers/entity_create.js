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

exports.entity_create = function (req, res)
{
    res.render('layouts/default.html',
    {
	partials:
	{
	    head: "includes/play_head.html",
	    header: "includes/header.html",
	    entitytreeview: "editor/entitytreeview.html",
	    texturebrowser: "editor/texture_browser.html",
	    editor: "ent_create.html",
	    content: "play.html",
	    footer: "includes/footer.html",
	    foot: "includes/foot.html"
	},
	nav_entcreate: true,
	User: req.user,
	EntryClass: "EntityCreate",
	navbardropdowns: req.viewGlobals.navbardropdowns,
	viewGlobals: req.viewGlobals
    });
};
