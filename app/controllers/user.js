var crypto = require('crypto'),
    user   = require('../models/user');

exports.login = function(req, res) {
    var email    = req.body.email.toLowerCase();
    var password = req.body.password.toLowerCase();
    var shasum   = crypto.createHash('sha1');
    shasum.update(password);

    user.isValidLogin(email, shasum.digest('hex'), function(isValid) {
    	if (isValid) {
    		// TODO: come up with actual login behavior here
    		return res.render('200', {message: 'Logged in successfully!'});
    	} else {
    		req.flash('error', 'Invalid username or password.');
    		return res.redirect('/');
    	}
    });
};
