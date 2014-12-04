var page = require('../controllers/page'),
    user = require('../controllers/user');

module.exports = function(app) {
    app.get('/', page.index);
    app.get('/login', page.login);
    app.post('/login', user.login);
    app.get('/logout', page.logout);
};
