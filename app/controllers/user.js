
var crypto = require('crypto'),
    user   = require('../models/user'),
    _      = require('underscore');

exports.login = function(req, res) {
    var username = req.body.username.toLowerCase();
    var password = req.body.password;
    var shasum   = crypto.createHash('sha1');
    shasum.update(password);
    user.isValidLogin(username, shasum.digest('hex'), function(isValid) {
    	if (isValid) {
    		console.log(username + ' logged in.');
    		req.session.username = username;
    		req.flash('success', 'Logged in successfully.');
    	} else {
    		console.log('Could not log ' + username + ' in.');
    		req.flash('error', 'Invalid username or password.');
    	}
    	return res.redirect('/');
    });
};

exports.register = function(req, res) {
	var username = req.body.username.toLowerCase();
	var password = req.body.password;
	var confirm  = req.body.password2;
	var email    = req.body.email;
	var fullName = req.body.fullName;

	if (password !== confirm) {
		console.log(username + ' could not register due to non-matching passwords.');
		req.flash('error', 'Passwords did not match.');
		return res.redirect('/register');
	}

	var shasum = crypto.createHash('sha1');
	shasum.update(password);

	// TODO: validate inuput
	user.register(username, shasum.digest('hex'), email, fullName, function(err) {
		if (!err) {
			console.log(username + ' has registered.');
			req.session.username = username;
			req.flash('success', 'Registered successfully.');
		} else {
			console.log('Could not register ' + username + ' for Eight.', err);
			req.flash('error', 'Could not register you.');
		}
		return res.redirect('/');
	});
};

exports.profile = function(req, res) {
	var username = req.params.username.toLowerCase();

	user.load(username, function(err, userObj) {
		if (err) {
			console.log('Could not load profile for ' + username + '.', err);
			req.flash('error', 'Could not load profile.');
			return res.redirect('/'); // TODO: something more intelligent here
		} else {

			user.friends(username, function(err, friends) {
				if (err) {
					console.log('Could not load friends for ' + username + '.',
						err);
					req.flash('error', 'Could not load profile.');
					return res.redirect('/');
				} else {

					user.getTrips(username, function(err, trips) {
						if (err) {
							console.log('Could not load trips for '
							 + username + '.', err);
							req.flash('error', 'Could not load profile.');
							return res.redirect('/');
						} else {
							return res.render('user', {
								user: userObj[0],
								// convert from object array to string array
								friends: _.map(friends, function(f) { return f.USERNAME.toLowerCase(); }),
								trips: _.map(trips, function(f) { return f.NAME; })
							});
						}
					});
				}
			});
		}
	});
}

// TODO: probably will not need this controller or route.
exports.friends = function (req, res) {
	var username = req.params.username.toLowerCase();

	user.friends(username, function(err, friends) {
		if (err || !friends) {
			return res.render('404', {message: 'Friends not found.'});
		}
		return res.render('friends', {
			friends: friends
		});
	});
};

exports.addFriend = function (req, res) {
	var username1 = req.session.username.toLowerCase();
	var username2 = req.params.username.toLowerCase();

	user.addFriend(username1, username2, function(err, results) {
		if (!err) {
			console.log(username1 + ' is now friends with ' + username2 + '.');
			return res.redirect('/users/' + username2);
		} else {
			console.log('Could not create friendship between ' + username1 + 
				' and ' + username2 + '.', err);
			req.flash('error', 'Could not add friend.');
			return res.redirect('/');
		}
	});
}

exports.removeFriend = function (req, res) {
	var username1 = req.session.username.toLowerCase();
	var username2 = req.params.username.toLowerCase();

	user.removeFriend(username1, username2, function(err) {
		if (!err) {
			console.log(username1 + ' is no longer friends with ' + username2 + '.');
			return res.redirect('/users/' + username2);
		} else {
			console.log('Error in unfriending ' + username1 + ' and ' + 
				username2 + '.', err);
			req.flash('error', 'Could not remove friend.');
			return res.redirect('/');
		}
	})
}

exports.getTrips = function (req, res) {
	var username = req.params.username.toLowerCase();

	user.getTrips(username, function(err, trips) {
		if (err || !trips) {
			return res.render('404', {message: 'Trips not found.'});
		}	
		return res.render('trips', {
			trips: trips,
			partials: {
				trips: 'partials/trips'
			}
		});
	});
}

exports.addTrip = function (req, res) {
	var username = req.body.username.toLowerCase();
	var tid = req.body.tid;
	
	user.addTrip(username, tid, function(wasSuccessful) {
		if (wasSuccessful) {
			console.log(username1 + ' is going on trip ' + tid +'.');
			return res.render('200', {message: 'Successfully added trip to user!'});
		} else {
			req.flash('error', 'Could not add trip to user.');
			return res.redirect('/');
		}
	});
}

