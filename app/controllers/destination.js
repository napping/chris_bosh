var destination = require('../models/destination');

exports.show = function(req, res) {
	destination.load(req.params.id, function(err, destination) {
		if (err || !destination || destination.length === 0) {
			return res.render('404', {message: 'Destination not found.'});
		}

		return res.render('destination', {
			destination: destination,
			partials: {
				destination: 'partials/destination'
			}
		});
	});
};

exports.create = function(req, res) {
	var name = req.body.name;
	destination.create(name, function(err, destination) {
		if (err || !destination || destination.length === 0) {
			return res.render('404', {message: 'Could not create destination.'});
		}

		return res.render('destination', {
			destination: destination,
			partials: {
				destination: 'partials/destination'
			}
		});
	});
};