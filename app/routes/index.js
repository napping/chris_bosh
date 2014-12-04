var page = require('../controllers/page'),
    user = require('../controllers/user'),
    auth = require('../middlewares/auth');

module.exports = function(app) {
    app.get('/', page.index);
    app.get('/login', page.login);
    app.post('/login', user.login);
    app.get('/logout', page.logout);

    // just a proof of concept that authentication middleware works
    app.get('/secret', auth.requireLogin, function (req, res) {
        res.send('If you are viewing this page, you are logged in.');
    });
};
