var trip = require('../models/trip');

exports.show = function(req, res) {
	trip.load(req.params.id, function(err, trip) {
		if (err || !trip || trip.length === 0) {
			return res.render('404', {message: 'Trip not found.'});
		}
		console.log(trip)
		return res.render('trip', {
			trip: trip,
			partials: {
				destination: 'partials/trip'
			}
		});
	});
};

exports.create = function(req, res) {
	var name = req.body.name;
	var packing_list = req.body.packing_list;
	var expenses = req.body.expenses;
	trip.create(name, packing_list, expenses, function(err, trip) {
		console.log(trip);
		if (err || !trip || trip.length === 0) {
			return res.render('404', {message: 'Could not create Trip.'});
		}

		console.log('Trip successfully created.');

		return res.render('trip', {
			trip: trip,
			partials: {
				trip: 'partials/trip'
			}
		});
	});
};