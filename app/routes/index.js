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
    app.get('/logout', auth.requireLogin, page.logout);
    app.post('/search', page.search);

    app.get('/users/:username', user.profile);
    app.get('/users/:username/edit', auth.requireLogin, user.edit);
    app.post('/users/:username/edit', auth.requireLogin, user.put);

    app.get('/destinations/new', auth.requireLogin, destination.new);
    app.get('/destinations/:id', destination.show);
    app.post('/destinations', auth.requireLogin, destination.create);

    app.get('/friends/:username', user.friends);
    app.post('/friends/:username', auth.requireLogin, user.requestFriend);
    // The next two routes are embarrassing. They should not be GETs.
    app.get('/friends/:username/accept', auth.requireLogin, user.addFriend);
    app.get('/friends/:username/decline', auth.requireLogin, user.declineFriendship);
    // hacky as hell to use a POST to do this, but I don't want to jQuery it currently
    app.post('/unfriend/:username', auth.requireLogin, user.removeFriend);
    app.post('/removeFriend', auth.requireLogin, user.removeFriend);

    app.get('/trips/new', auth.requireLogin, trip.new);
    app.get('/trips/:id', trip.show);
    app.post('/trips', auth.requireLogin, trip.create);

    app.post('/goeson', auth.requireLogin, user.addTrip);
    app.get('/goeson/:username', user.getTrips);

    app.get('/about', page.about);
};
