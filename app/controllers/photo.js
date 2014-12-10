var photo       = require('../models/photo'),
	user        = require('../models/user'),
	trip        = require('../models/trip');

var _ = require('underscore');

exports.show = function (req, res) {
    photo.getUrlByID(req.params.pid, function (err, url) {
		if (err || !url) {
			console.log('Could not find photo.', err);
			req.flash('error', 'Could not find photo.');
			return res.redirect('/');
		}
		console.log('Showing photo.');
        return res.render( "photo", { url: url } );
    });

}

exports.new = function(req, res) {
	return res.render('new_photo');
}

exports.create = function(req, res) {
	var url = req.body.url;
    // console.log(req);
	photo.create(url, req.session.username, function(err, pid, url) {
		if (err || !pid) {
			console.log('Could not create photo.', err);
			req.flash('error', 'Could not create photo.');
			return res.redirect('/');
		}
		console.log('Created photo.');
		return res.redirect('/photo/' + pid);
	});
};

// Not used, method was moved to controller/user.js
exports.showUserPhotos = function (req, res) {
    console.log("Params : ", req.params);
	photo.forUser(req.params.username, function(err, photos) {
		if (err || !destination || destination.length === 0) {
			console.log('Destination ' + req.params.id + ' not found.', err);
			return res.redirect('/');
		}

        return res.render('destination', {
            photos: photos
        });
	});
}
