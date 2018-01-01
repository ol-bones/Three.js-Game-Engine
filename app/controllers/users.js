'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const { wrap: async } = require('co');
const { respond } = require('../utils');
const User = mongoose.model('User');

/**
 * Load
 */

exports.load = async(function* (req, res, next, _id) {
  const criteria = { _id };
  try {
    req.profile = yield User.load({ criteria });
    if (!req.profile) return next(new Error('User not found'));
  } catch (err) {
    return next(err);
  }
  next();
});

/**
 * Create user
 */

exports.create = async(function* (req, res) {
  const user = new User(req.body);
  user.provider = 'local';
  user.Access = 1;
  try {
    yield user.save();
    req.logIn(user, err => {
      if (err) req.flash('info', 'Sorry! We are not able to log you in!');
      return res.redirect('/');
    });
  } catch (err) {
    const errors = Object.keys(err.errors)
      .map(field => err.errors[field].message);

    res.render("layouts/default",
    {
	partials:
	{
	    head: "includes/head.html",
	    header: "includes/header.html",
	    content: "users/signup.html",
	    footer: "includes/footer.html",
	    foot: "includes/foot.html"
	},
	loginrrors: errors,
	User: req.user
    });
  }
});

/**
 *  Show profile
 */

exports.show = function (req, res) {
  const user = req.profile;
  console.log(user);
  res.render("layouts/default",
    {
	partials:
	{
	    head: "includes/head.html",
	    header: "includes/header.html",
	    content: "users/show.html",
	    footer: "includes/footer.html",
	    foot: "includes/foot.html"
	},
	nav_account: true,
	profile: user,
	User: req.user
    });
};

exports.signin = function () {};

/**
 * Auth callback
 */

exports.authCallback = login;

/**
 * Show login form
 */

exports.login = function (req, res) {
    res.render("layouts/default",
    {
	partials:
	{
	    head: "includes/head.html",
	    header: "includes/header.html",
	    content: "users/login.html",
	    footer: "includes/footer.html",
	    foot: "includes/foot.html"
	},
	csrf: res.locals.csrf_token,
	User: req.user
    });
};

/**
 * Show sign up form
 */

exports.signup = function (req, res) {
    res.render("layouts/default",
    {
	partials:
	{
	    head: "includes/head.html",
	    header: "includes/header.html",
	    content: "users/signup.html",
	    footer: "includes/footer.html",
	    foot: "includes/foot.html"
	},
	csrf: res.locals.csrf_token,
	submit_user: new User(),
	User: req.user
    });
};

/**
 * Logout
 */

exports.logout = function (req, res) {
  req.logout();
  res.redirect('/login');
};

/**
 * Session
 */

exports.session = login;

/**
 * Login
 */

function login (req, res) {
  const redirectTo = req.session.returnTo
    ? req.session.returnTo
    : '/';
  delete req.session.returnTo;
  res.redirect(redirectTo);
}
