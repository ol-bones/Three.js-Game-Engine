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
    res.render('articles/index');
};


