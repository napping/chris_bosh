var page = require('../controllers/pages');

module.exports = function(app) {
    app.get('/', page.index);
    app.get('/login', page.login);
    app.get('/logout', page.logout);
};
