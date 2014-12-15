var page = require('../controllers/page'),
    user = require('../controllers/user'),
    destination = require('../controllers/destination'),
    trip = require('../controllers/trip'),
    auth = require('../middlewares/auth'),
    photo = require('../controllers/photo'),
    album = require('../controllers/album'),
    hashtag = require('../controllers/hashtag');

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
    app.post('/trips/album', auth.requireLogin, trip.addAlbum);
    app.get('/trips/:id', trip.show);
    app.post('/trips/:id', auth.requireLogin, trip.requestTrip);
    //is there a better way to do this?
    app.get('/trips/:id/:username/acceptRequest', auth.requireLogin, trip.acceptRequest);
    app.get('/trips/:id/:username/declineRequest', auth.requireLogin, trip.declineRequest);
    app.get('/trips/:id/acceptInvitation', auth.requireLogin, trip.acceptInvitation);
    app.get('/trips/:id/declineInvitation', auth.requireLogin, trip.declineInvitation);

    app.post('/trips/:id/invite', auth.requireLogin, trip.inviteUser)
    app.post('/trips/:id/leave', auth.requireLogin, trip.removeAttendee);
    app.get('/trips/:id/edit', auth.requireLogin, trip.edit);
    app.post('/trips/:id/edit', auth.requireLogin, trip.put);
    app.post('/trips', auth.requireLogin, trip.create);
    app.get('/trips/:id/comment', auth.requireLogin, trip.comment);
    app.post('/trips/:id/comment', auth.requireLogin, trip.addComment);

    app.post('/goeson', auth.requireLogin, user.addTrip);
    app.get('/goeson/:username', user.getTrips);

    app.post('/photos', auth.requireLogin, photo.create);
    app.get('/photos/:pid', photo.show);
    app.get('/photos/:id/comment', auth.requireLogin, photo.comment);
    app.post('/photos/:id/comment', auth.requireLogin, photo.addComment);

    app.get('/about', page.about);

    app.get('/albums/new', auth.requireLogin, album.new);
    app.get('/albums/edit/:id', auth.requireLogin, album.editAlbum);
    app.post('/albums/save/:id', auth.requireLogin, album.saveEdits);
    app.post('/albums/new', auth.requireLogin, album.create);
    app.post('/albums/photo', auth.requireLogin, album.uploadPhoto);
    app.get('/albums/:id', auth.requireLogin, album.show);

    app.post('/hashtags/add', auth.requireLogin, hashtag.add);
    app.get('/hashtags/search', auth.requireLogin, hashtag.search);
    app.post('/hashtags/search', auth.requireLogin, hashtag.query);
    // app.get('/hashtags/:tag', auth.requireLogin, hashtag.show);
};
