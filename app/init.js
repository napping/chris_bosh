var express = require('express'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    flash = require('connect-flash'),
    config = require('../config/config');
    path = require('path');

module.exports = function(app) {
    app.set('port', process.env.PORT || 8080);

    app.engine('html', require('ejs').renderFile);
    app.set('views', config.appRoot + '/views');
    app.set('view engine', 'ejs');

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));

    app.use(cookieParser(config.cookieSecret));
    app.use(session({
        secret: config.cookieSecret,
        cookie: {maxAge: 1000 * 60 * 60},
        saveUninitialized: true,
        resave: true
    }));
    app.use(flash());

    app.locals.site = config.site;

    app.use(function(req, res, next) {
        res.locals.successFlashes = req.flash('success');
        res.locals.errorFlashes = req.flash('error');

        if (req.session.username) {
            //res.locals.layout = 'layouts/user';
            res.locals.authUser = req.session.username;
        } else {
            //res.locals.layout = 'layouts/guest';
            res.locals.authUser = false;
        }

        next();
    });

    require('./routes')(app);

    app.use('/static', express.static(config.root + '/public'));

    // app.use(function(req, res) {
    //      res.status(404).render('404', {message: 'Page not found!'});
    // });

    // app.use(function(err, req, res, next) {
    //      console.error(err);
    //      res.render('500', {message: err.message});
    // });
};
