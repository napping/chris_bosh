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
				trip.tripRequests(currTrip.TID, function(err, requests) {
					if (err || !requests) {
						console.log('Could not load trip requests on ' +
							currTrip.TID + '.' + err);
						return res.render('/');
					}
					return res.render('trips', {
						trip: currTrip,
						attendees: _.map(attendees, function(f) { return f.USERNAME; }),
						destinations: destinations,
						requests: requests,
						partials: {
							destination: 'partials/trips'
						}
					});
				});
			});
		});
	});
};

exports.edit = function(req, res) {
	var tid = req.params.id;
	var currUser = req.session.username.toLowerCase();
	trip.load(tid, function(err, tripObj) {
		if (err) {
			// Should never happen, since this is a valid user by authentication.
			console.log('Could not load trip for ' + tid + '.', err);
			console.log('This is unusual: something weird has happened.');
			return res.redirect('/');
		} else {
			if (tripObj.OWNER != currUser) {
				return res.redirect('/');
			}
			else {
				return res.render('edit_trip', {
					trip: tripObj
				});
			}
		}
	});
};



exports.requestTrip = function(req, res) {

	var tid = req.params.id;
	var username = req.session.username.toLowerCase();

	trip.onTrip(tid, username, function(onTrip) {
		if (onTrip) {
			console.log(username + ' is already on trip ' + tid + '.');
			return res.redirect('/trips/' + tid);
		}
		trip.requestTrip(tid, username, function(requested) {
			if (!requested) {
				console.log('Trip request error from ' + username + ' to trip ' + tid + '.');
			} else {
				console.log('Trip request made from ' + username + ' to trip ' + tid + '.');
			}
			return res.redirect('/trips/' + tid);
		});
	});

}

exports.addAttendee = function(req, res) {
	var currUser = req.session.username.toLowerCase();
	var tid = req.params.id;
	var username = req.params.username.toLowerCase();

	trip.load(tid, function(err, tripObj) {
		if (err || !tripObj || tripObj.length === 0) {
			console.log('Trip ' + tid + ' could not be loaded.');
			return res.redirect('/');
		}
		if (tripObj.OWNER != currUser) {
			console.log('Could not accept request for trip ' + tid + '.');
			return res.redirect('/trips/' + tid);
		}
		trip.addAttendee(tid, username, function(err, results) {
			if (!err) {
				console.log(username + ' is on now trip ' + tid + '.');
				return res.redirect(req.header('Referer') || '/');
			} else {
				console.log('Could not add ' + username + ' to trip ' + tid + '.');
				req.flash('error', 'Could not add user to trip.');
				return res.redirect(req.header('Referer') || '/');
			}
		});
	});
}

exports.declineRequest = function (req, res) {
	var currUser = req.session.username.toLowerCase();
	var tid = req.params.id;
	var username = req.params.username.toLowerCase();

	trip.load(tid, function(err, tripObj) {
		if (err || !tripObj || tripObj.length === 0) {
			console.log('Trip ' + tid + ' could not be loaded.');
			return res.redirect('/');
		}
		if (tripObj.OWNER != currUser) {
			console.log('Could not accept request for trip ' + tid + '.');
			return res.redirect('/trips/' + tid);
		}
		trip.deleteTripRequest(tid, username, function(deleted) {
			if (!deleted) {
				console.log('Could not decline the request of ' + username + ' for trip ' + tid + '.');
			} else {
				console.log(username + '\'s request to be on trip ' + tid + ' was declined.');
			}
			return res.redirect(req.header('Referer') || '/');
		});
	});
}

exports.removeAttendee = function (req, res) {
	var username = req.session.username.toLowerCase();
	var tid = req.params.id;

	trip.removeAttendee(tid, username, function(err) {
		if (!err) {
			console.log(username + ' is no longer on trip ' + tid + '.');
			return res.redirect('/trips/' + tid);
		} else {
			console.log('Error in removing ' + username + ' from trip ' + tid, err);
			req.flash('error', 'Could not remove attendee.');
			return res.redirect('/');
		}
	});
};

exports.put = function(req, res) {

	var tid 	= req.params.id;
	var name    = req.body.name;
	var packing_list = req.body.packing_list;
	var expenses = req.body.expenses;

	trip.save(tid, name, packing_list, expenses, function(err) {
		if (err) {
			console.log('Could not update trip of ' + name + '.', err);
			return res.redirect('/trips/' + tid + '/edit');
		} else {
			console.log('Saved trip for ' + name + '.');
			return res.redirect('/trips/' + tid);
		}
	});
}

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
