var crypto = require('crypto'),
    user   = require('../models/user');

exports.login = function(req, res) {
    var username = req.body.username.toLowerCase();
    var password = req.body.password;
    var shasum   = crypto.createHash('sha1');
    shasum.update(password);
    //user.isValidLogin(username, 'default', function(isValid) { // good for testing
    user.isValidLogin(username, shasum.digest('hex'), function(isValid) {
    	if (isValid) {
    		console.log(username + ' logged in.');
    		req.session.username = username;
            return res.render('200', {message: 'Logged in successfully!'});
    	} else {
    		req.flash('error', 'Invalid username or password.');
    		return res.redirect('/');
    	}
    });
};

exports.register = function(req, res) {
	var username = req.body.username.toLowerCase();
	var password = req.body.password;
	var email    = req.body.email;
	var fullName = req.body.fullName;

	var shasum   = crypto.createHash('sha1');
	shasum.update(password);

	// TODO: validate inuput
	user.register(username, shasum.digest('hex'), email, fullName, function(wasSuccessful) {
		if (wasSuccessful) {
			console.log(username + ' has registered for the site.');
			req.session.username = username;
			return res.render('200', {message: 'Successfully registered!'});
		} else {
			req.flash('error', 'Could not register you.');
			return res.redirect('/');
		}
	});
};

exports.friends = function (req, res) {
	var username = req.params.username.toLowerCase();

	user.friends(username, function(err, friends) {
		if (err || !friends || friends.length === 0) {
			console.log(err);
			return res.render('404', {message: 'Friends not found.'});
		}
		return res.render('friends', {
			friends: friends,
			partials: {
				friends: 'partials/friends'
			}
		});
	});
};

exports.addFriend = function (req, res) {
	var username1 = req.body.username1.toLowerCase();
	var username2 = req.body.username2.toLowerCase();

	uer.addFriend(username1, username2, function(wasSuccessful) {
		if (wasSuccessful) {
			console.log(username1 + ' is now friends with ' + username2 + '.');
			return res.render('200', {message: 'Successfully added friend!'});
		} else {
			req.flash('error', 'Could not add friend.');
			return res.redirect('/');
		}
		
	});
}

