var destination = require('../models/destination'),
	user        = require('../models/user'),
	hashtag     = require('../models/hashtag'),
	trip        = require('../models/trip');

var _ = require('underscore');

exports.show = function(req, res) {
	destination.load(req.params.id, function(err, foundDestinations) {
		if (err || !foundDestinations || foundDestinations.length === 0) {
			console.log('Destination ' + req.params.id + ' not found.', err);
			return res.redirect('/');
		}

		user.forDestination(req.params.id, req.session.username, function(err, users) {
			if (err) {
				console.log('Could not load people who visited ' + 
					req.params.id + '.', err);
				return res.redirect('/');
			} else {
				trip.forDestination(req.params.id, req.session.username, function(err, trips){
					if (err) {
						console.log('Could not load trips including ' + 
							req.params.id + '.', err);
						return res.redirect('/');
					}
                    destination.getOwner(req.params.id, function(err, owner) {
                        var isOwner = false;
                        if (owner == req.session.username) {
                            isOwner = true;
                        }

                        var hashtags = [];
                        hashtag.getAllByMedia(req.params.id, function (err, receivedHashtags) { 
                            if (err) { 
                                console.log("Could not get hashtags", mid);
                                return res.redirect('/destinations/' + req.params.id);
                            } 

                            if (receivedHashtags && receivedHashtags.length > 0) { 
                                hashtags = receivedHashtags;
                            }

                            return res.render('destination', {
                                destination: foundDestinations,
                                trips: trips,
                                visitors: _.first(_.shuffle(users), 10),
                                // TODO: make this an actual value
                                isOwner: isOwner,
                                did: req.params.id,
                                hashtags: hashtags, 
                                url: '/images/filler.jpg'
                            });
                       });
                   });
				})
			}
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
