var page = require('../controllers/page'),
    user = require('../controllers/user'),
    destination = require('../controllers/destination'),
    trip = require('../controllers/trip'),
    auth = require('../middlewares/auth');

module.exports = function(app) {
    app.get('/', page.index);
    app.get('/login', page.login);
    app.post('/login', user.login);
    app.get('/register', page.register);
    app.post('/register', user.register);
    app.get('/logout', page.logout);
    app.get('/users/:username', user.profile);
    app.get('/users/:username/edit', auth.requireLogin, user.edit);
    app.post('/users/:username/edit', auth.requireLogin, user.put);

    app.get('/destinations/new', auth.requireLogin, destination.new);
    app.get('/destinations/:id', destination.show);
    app.post('/destinations', auth.requireLogin, destination.create);

    app.get('/friends/:username', user.friends);
    app.post('/friends/:username', auth.requireLogin, user.addFriend);
    // hacky as hell to use a POST to do this, but I don't want to jQuery it currently
    app.post('/unfriend/:username', auth.requireLogin, user.removeFriend);
    app.post('/removeFriend', auth.requireLogin, user.removeFriend);

 

    app.get('/trips/:id', trip.show);
    app.post('/trips', trip.create);

    app.post('/goeson', user.addTrip);
    app.get('/goeson/:username', user.getTrips);

    // just a proof of concept that authentication middleware works
    app.get('/secret', auth.requireLogin, function (req, res) {
        res.send('If you are viewing this page, you are logged in.');
    });

    app.get('/about', page.about)

    // TODO For testing
    app.get('/about', page.about);
};
