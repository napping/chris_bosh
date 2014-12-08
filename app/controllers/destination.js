var destination = require('../models/destination'),
	user        = require('../models/user');

var _ = require('underscore');

exports.show = function(req, res) {
	destination.load(req.params.id, function(err, destination) {
		if (err || !destination || destination.length === 0) {
			console.log('Destination ' + req.params.id + ' not found.', err);
			return res.redirect('/');
		}

		user.forDestination(req.params.id, req.session.username, function(err, users) {
			if (err) {
				console.log('Could not load people who visited ' + 
					req.params.id + '.', err);
				return res.redirect('/');
			}
			return res.render('destination', {
				destination: destination,
				visitors: _.first(_.shuffle(users), 10)
			});
		});
	});
};

exports.new = function(req, res) {
	return res.render('new_destination');
}

exports.create = function(req, res) {
	var name = req.body.name;
	destination.create(name, req.session.username, function(err, did, name) {
		if (err || !did) {
			console.log('Could not create destination ' + name + '.', err);
			req.flash('error', 'Could not create destination.');
			return res.redirect('/');
		}
		console.log('Created destination ' + name + '.');
		return res.redirect('/destinations/' + did);
	});
};