var trip = require('../models/trip');

var _ = require('underscore');

exports.show = function(req, res) {
	trip.load(req.params.id, function(err, currTrip) {
		if (err || !currTrip || currTrip.length === 0) {
			return res.render('404', {message: 'Trip not found.'});
		}
		trip.usersOnTrip(currTrip.TID, function(err, attendees) {
			if (err || !attendees) {
				return console.log('Could not load users attending '+
					currTrip.TID + '.' + err);
				return res.render('/');
			}
			trip.destinationsOnTrip(currTrip.TID, function(err, destinations) {
				if (err || !destinations) {
					return console.log('Could not load destinations on ' +
						currTrip.TID + '.' + err);
					return res.render('/');
				}
				console.log(destinations);
				console.log(attendees);
				console.log(currTrip);
				return res.render('trips', {
					trip: currTrip,
					attendees: _.map(attendees, function(f) { return f.USERNAME; }),
					destinations: destinations,
					partials: {
						destination: 'partials/trips'
					}
				});
			});

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

		return res.render('trips', {
			trip: trip,
			partials: {
				trip: 'partials/trips'
			}
		});
	});
};