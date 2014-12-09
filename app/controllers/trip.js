var trip = require('../models/trip');

var _ = require('underscore');

exports.show = function(req, res) {
	trip.load(req.params.id, function(err, currTrip) {
		if (err || !currTrip || currTrip.length === 0) {
			return res.render('404', {message: 'Trip not found.'});
		}
		trip.usersOnTrip(currTrip.TID, function(err, attendees) {
			if (err || !attendees) {
				console.log('Could not load users attending '+
					currTrip.TID + '.' + err);
				return res.render('/');
			}
			trip.destinationsOnTrip(currTrip.TID, function(err, destinations) {
				if (err || !destinations) {
					console.log('Could not load destinations on ' +
						currTrip.TID + '.' + err);
					return res.render('/');
				}
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

exports.new = function(req, res) {
	return res.render('new_trip');
};

exports.create = function(req, res) {
	var name = req.body.name;
	var packing_list = req.body.packing_list;
	var expenses = req.body.expenses;
	trip.create(req.session.username, name, packing_list, expenses, function(err, tid) {
		if (err || !tid || tid.length === 0) {
			console.log('Could not create trip ' + tid + '.', err);
			req.flash('error', 'Could not create trip.');
			return res.redirect('/');
		}
		console.log('Created trip ' + tid + '.');
		return res.redirect('/trips/' + tid);
	});
};