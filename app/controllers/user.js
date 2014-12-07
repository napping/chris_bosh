var crypto = require('crypto'),
    user   = require('../models/user');

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

	var shasum   = crypto.createHash('sha1');
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