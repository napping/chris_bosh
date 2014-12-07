var page = require('../controllers/page'),
    user = require('../controllers/user'),
    destination = require('../controllers/destination'),
    auth = require('../middlewares/auth');

module.exports = function(app) {
    app.get('/', page.index);
    app.get('/login', page.login);
    app.post('/login', user.login);
    app.get('/register', page.register);
    app.post('/register', user.register);
    app.get('/logout', page.logout);

    app.get('/destination/:id', destination.show);
    app.post('/destination', auth.requireLogin, destination.create);

    // just a proof of concept that authentication middleware works
    app.get('/secret', auth.requireLogin, function (req, res) {
        res.send('If you are viewing this page, you are logged in.');
    });

    app.get('/about', page.about)

    // TODO For testing
    app.get('/home', page.testHome);
    app.get('/user', page.testUser);
};
