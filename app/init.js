var express = require('express'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    flash = require('connect-flash'),
    config = require('../config/config');

module.exports = function(app) {
    app.set('port', process.env.PORT || 8080);

    app.engine('html', require('hogan-express'));
    app.set('views', config.appRoot + '/views');
    app.set('view engine', 'html');

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

        if (req.user) {
            res.locals.layout = 'layouts/user';
            res.locals.authUser = req.user;
        }

        next();
    });

    require('./routes')(app);
    app.use('/static', express.static(config.root + '/public'));

    app.use(function(req, res) {
        res.status(404).render('404', {message: 'Page not found!'});
    });

    app.use(function(err, req, res, next) {
        console.error(err);
        res.status(500).render('./index.html', {message: err.message});
        // res.render("<h1>HEY!</h1>");
    });
};
