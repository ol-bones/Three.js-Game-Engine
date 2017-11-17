'use strict';

/*
 * Module dependencies.
 */

const index = require('../app/controllers/index');
const users = require('../app/controllers/users');
const play = require('../app/controllers/play');
const admin = require('../app/controllers/admin');
const no_beta = require('../app/controllers/no_beta');
const edit = require('../app/controllers/edit');

const auth = require('./middlewares/authorization');

/**
 * Route middlewares
 */

const fail =
{
    failureRedirect: '/login'
};

/**
 * Expose routes
 */

module.exports = function (app, passport, viewGlobals)
{
    const pauth = passport.authenticate.bind(passport);

    app.use(function(req, res, next)
    {
        //console.log(g_ServerList);
        var allowedOrigins = ['http://sarian.world:80', 'http://sarian.world:5000', 'http://sarian.world:7990'];

        var origin = req.headers.origin;
        if(allowedOrigins.indexOf(origin) > -1)
        {
            res.setHeader('Access-Control-Allow-Origin', origin);
        }

        res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.header('Access-Control-Allow-Credentials', true);

        req.viewGlobals = viewGlobals;
	if(req.user && req.user.Access)
	{
	    req.user.canplay = req.user.Access >= 500;
	    req.user.canedit = req.user.Access >= 750;
	    req.user.canadmin = req.user.Access >= 1000;
	}


        next();
    });

    // play routes
    app.get('/', index.index);
    app.get('/no_beta_access', auth.requiresLogin, no_beta.no);
    app.get('/play', auth.requiresLogin, play.play);
    app.get('/edit', auth.requiresLogin, edit.editor);

    // user routes
    app.get('/login', users.login);
    app.get('/signup', users.signup);
    app.get('/logout', users.logout);

    app.post('/users', users.create);
    app.post('/users/session',
    pauth('local',
    {
        failureRedirect: '/login',
        failureFlash: 'Invalid email or password.'
    }), users.session);

    app.get('/users/:userId', users.show);
    app.param('userId', users.load);

    app.get('/admin', auth.requiresLogin, admin.main);
    app.post('/admin/updateuser', auth.requiresLogin, admin.updateuser);

    app.get("/recordings/", (req,res) => res.send("kek"));
    app.get("/a2billing/admin/Public/index.php", (req,res) => res.send("kek"));

    /**
    * Error handling
    */

    app.use(function (err, req, res, next)
    {
        // treat as 404
        if (err.message
        && (~err.message.indexOf('not found')
        || (~err.message.indexOf('Cast to ObjectId failed'))))
        {
            return next();
        }

        console.error(err.stack);

        if (err.stack.includes('ValidationError'))
        {
            res.status(422).render('layouts/default.html',
	    {
		partials:
		{
		    head: "includes/head.html",
		    header: "includes/header.html",
		    content: "500.html",
		    footer: "includes/footer.html",
		    foot: "includes/foot.html"
		},
		error: err.stack
	    });
            return;
        }

        // error page
        res.status(500).render('layouts/default.html',
	{
	    partials:
	    {
		head: "includes/head.html",
		header: "includes/header.html",
		content: "500.html",
		footer: "includes/footer.html",
		foot: "includes/foot.html"
	    },
	    error: err.stack
	});
    });

    // assume 404 since no middleware responded
    app.use(function (req, res)
    {
        const payload =
        {
            url: req.originalUrl,
            error: 'Not found'
        };
        res.status(404).render('layouts/default.html',
	{
	    partials:
	    {
		head: "includes/head.html",
		header: "includes/header.html",
		content: "500.html",
		footer: "includes/footer.html",
		foot: "includes/foot.html"
	    },
	    error: payload.error
	});
    });
};
