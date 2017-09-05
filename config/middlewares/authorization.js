'use strict';

/*
 *  Generic require login routing middleware
 */

exports.requiresLogin = function (req, res, next) {
  if(req.originalUrl === "/admin" && req.user && req.user.Access !== 1000)
  {
    res.redirect("/");
  }
  else if(req.originalUrl === "/play" && req.user && req.user.Access <= 1)
  {
    res.redirect("/no_beta_access");
  }
  if (req.isAuthenticated()) return next();
  if (req.method == 'GET') req.session.returnTo = req.originalUrl;
  res.redirect('/login');
};

/*
 *  User authorization routing middleware
 */

exports.user = {
  hasAuthorization: function (req, res, next) {
    if (req.profile.id != req.user.id) {
      req.flash('info', 'You are not authorized');
      return res.redirect('/users/' + req.profile.id);
    }
    next();
  }
};

