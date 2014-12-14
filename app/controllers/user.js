var crypto		 = require('crypto'),
    user  		 = require('../models/user'),
    destination  = require('../models/destination'),
    photo        = require('../models/photo'),
    album        = require('../models/album'),
    _     		 = require('underscore');

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
	var username    = req.body.username.toLowerCase();
	var password    = req.body.password;
	var confirm     = req.body.password2;
	var email       = req.body.email;
	var fullName    = req.body.fullName;
	var affiliation = req.body.affiliation;
	var interests   = req.body.interests;

	if (password !== confirm) {
		console.log(username + ' could not register due to non-matching passwords.');
		req.flash('error', 'Passwords did not match.');
		return res.redirect('/register');
	}

	var shasum = crypto.createHash('sha1');
	shasum.update(password);

	// TODO: validate inuput. ESPECIALLY usernames! Ugh
	user.register(username, shasum.digest('hex'), email, fullName, affiliation, interests, function(err) {
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

exports.edit = function(req, res) {
	var src = req.session.username.toLowerCase();
	var tgt = req.params.username.toLowerCase();
	if (src !== tgt) {
		return res.redirect('/');
	} else {
		user.load(src, function(err, userObj) {
			if (err) {
				// Should never happen, since this is a valid user by authentication.
				console.log('Could not load profile for ' + username + '.', err);
				console.log('This is unusual: something weird has happened.');
				return res.redirect('/');
			} else {
				return res.render('edit_profile', {
					user: userObj
				});
			}
		});
	}
};

exports.put = function(req, res) {
	var src = req.session.username.toLowerCase();
	var tgt = req.params.username.toLowerCase();
	if (src !== tgt) {
		return res.redirect('/');
	}

	var email    = req.body.email;
	var fullName = req.body.fullName;
	var affiliation = req.body.affiliation;
	var interests = req.body.interests;

	user.save(src, email, fullName, affiliation, interests, function(err) {
		if (err) {
			console.log('Could not update profile of ' + src + '.', err);
			return res.redirect('/users/' + src + '/edit');
		} else {
			console.log('Saved profile for ' + src + '.');
			return res.redirect('/users/' + src);
		}
	});
};

exports.profile = function(req, res) {
	var username = req.params.username.toLowerCase();

    user.load(username, function(err, userObj) {
        if (err) {
            console.log('Could not load profile for ' + username + '.', err);
            req.flash('error', 'Could not load profile.');
            return res.redirect('/'); // TODO: something more intelligent here
        } else {
            user.friends(username, function(err, friends) {
                if (err) {
                    console.log('Could not load friends for ' + username + '.',
                                err);
                                req.flash('error', 'Could not load profile.');
                                return res.redirect('/');
                } else {
                    var photos = [];
                    var profilePhoto = 0;
                    var albums = [];
                    photo.forUser(username, function(err, userPhotos) {
                        if (err) {
                            console.log('Could not find photos for user ', username, '.', err);
                            // return res.redirect('/');    Don't need, just keep the photos array empty
                        } else { 
                            photos = userPhotos;
                            profilePhoto = userPhotos[photos.length - 1];
                            album.forUser(username, function(err, userAlbums) {
                                if (err) {
                                    console.log('Could not find albums for user ', username, '.', err);
                                    // return res.redirect('/');    Don't need, just keep the albums array empty
                                } else { 
                                    albums = userAlbums;
                                    user.getTrips(username, function(err, trips) {
                                        if (err) {
                                            console.log('Could not load trips for '
                                                        + username + '.', err);
                                                        req.flash('error', 'Could not load profile.');
                                                        return res.redirect('/');
                                        } 
                                        destination.forUser(username, req.session.username, function(err, destinations) {
                                            if (err) {
                                                console.log('Could not load destinations for '
                                                            + username + '.', err);
                                                            req.flash('error', 'Could not load profile.');
                                                            return res.redirect('/');
                                            } else {
                                                if (req.session.username && req.session.username.toLowerCase() === username) {
                                                    user.friendRequests(username, function(err, requests) {
                                                        if (err) {
                                                            console.log('Error loading friend requests for ' + username + '.', err);
                                                            return res.redirect('/');
                                                        } else {
                                                            user.tripInvitations(username, function(err, invitations) {
                                                                if (err) {
                                                                    console.log('Error loading trip invitations for ' + username + '.', err);
                                                                    return res.redirect('/');
                                                                } else {

                                                                    user.allCotravelers(username, function(err, cotravelers) {
                                                                        if (err) {
                                                                            console.log('Error loading recommended friends for ' + username + '.', err);
                                                                            return res.redirect('/');
                                                                        } else {
                                                                            user.getFriendDestinations(username, function(err, friendDestinations) {
                                                                                if (err) {
                                                                                    console.log('Error loading friend destinatinos for ' + username + '.', err);
                                                                                    return res.redirect('/');
                                                                                }
                                                                                else {
                                                                                    var friendNames = _.map(friends, function(f) { return f.USERNAME.toLowerCase(); });
                                                                                    var cotravelerNames = _.map(cotravelers, function(f) { return f.USERNAME.toLowerCase(); });
                                                                                    return res.render('user', {
                                                                                        user: userObj,
                                                                                        // convert from object array to string array
                                                                                        friends: friendNames,
                                                                                        trips: trips,
                                                                                        destinations: destinations,
                                                                                        requests: requests,
                                                                                        photos: photos,
                                                                                        albums: albums,
                                                                                        invitations: invitations,
                                                                                        profile: profilePhoto,
                                                                                        upload: 1,
                                                                                        recommendedFriends: _.filter(cotravelerNames, function(f) { return friendNames.indexOf(f) === -1}),
                                                                                        recommendedDestinations: _.filter(friendDestinations, function(f) { return destinations.indexOf(f) === -1 })
                                                                                    });
                                                                                }
                                                                            });
                                                                        }
                                                                    })
                                                                }
                                                            });
                                                        }
                                                    });
                                                } else {
                                                    return res.render('user', {
                                                        user: userObj,
                                                        // convert from object array to string array
                                                        friends: _.map(friends, function(f) { return f.USERNAME.toLowerCase(); }),
                                                        trips: trips,
                                                        destinations: destinations,
                                                        photos: photos,
                                                        profile: profilePhoto,
                                                        albums: albums,
                                                        upload: 0,
                                                        requests: []
                                                    });
                                                }
                                            }
                                        });
                                    });

                                }
                            });
                        }
                    });
				}
			});
        }
    });
};

// TODO: probably will not need this controller or route.
exports.friends = function (req, res) {
	var username = req.params.username.toLowerCase();

	user.friends(username, function(err, friends) {
		if (err || !friends) {
			return res.render('404', {message: 'Friends not found.'});
		}
		return res.render('friends', {
			friends: friends
		});
	});
};

exports.requestFriend = function (req, res) {
	var requester = req.session.username.toLowerCase();
	var requestee = req.params.username.toLowerCase();

	user.friendsWith(requester, requestee, function(areFriends) {
		if (areFriends) {
			return res.redirect('/users/' + requestee);
		}
		user.requestFriend(requester, requestee, function(requested) {
			if (!requested) {
				console.log('Friend request error from ' + requester + ' to ' + requestee + '.');
			} else {
				console.log('Friend request made from ' + requester + ' to ' + requestee + '.');
			}
			return res.redirect('/users/' + requestee);
		});
	});
};

// Accepts a friend request.
exports.addFriend = function (req, res) {
	var requestee = req.session.username.toLowerCase();
	var requester = req.params.username.toLowerCase();

	user.friendsWith(requester, requestee, function(areFriends) {
		if (areFriends) {
			return res.redirect(req.header('Referer') || '/');
		}

		user.addFriend(requester, requestee, function(err, results) {
			if (!err) {
				console.log(requester + ' is now friends with ' + requestee + '.');
				return res.redirect(req.header('Referer') || '/');
			} else {
				console.log('Could not create friendship between ' + requester + 
					' and ' + requestee + '.', err);
				req.flash('error', 'Could not add friend.');
				return res.redirect(req.header('Referer') || '/');
			}
		});
	});
};

exports.declineFriendship = function (req, res) {
	var requestee = req.session.username.toLowerCase();
	var requester = req.params.username.toLowerCase();

	user.deleteFriendRequest(requester, requestee, function(deleted) {
		if (!deleted) {
			console.log('Could not decline the friendship of ' + requester + ' and ' + requestee + '.');
		} else {
			console.log(requestee + ' declined the friendship of ' + requester + '.');
		}
		return res.redirect(req.header('Referer') || '/');
	});
}

exports.removeFriend = function (req, res) {
	var username1 = req.session.username.toLowerCase();
	var username2 = req.params.username.toLowerCase();

	user.removeFriend(username1, username2, function(err) {
		if (!err) {
			console.log(username1 + ' is no longer friends with ' + username2 + '.');
			return res.redirect('/users/' + username2);
		} else {
			console.log('Error in unfriending ' + username1 + ' and ' + 
				username2 + '.', err);
			req.flash('error', 'Could not remove friend.');
			return res.redirect('/');
		}
	})
};

exports.getTrips = function (req, res) {
	var username = req.params.username.toLowerCase();

	user.getTrips(username, function(err, trips) {
		if (err || !trips) {
			return res.render('404', {message: 'Trips not found.'});
		}	
		return res.render('trips', {
			trips: trips
		});
	});
};

exports.addTrip = function (req, res) {
	var username = req.body.username.toLowerCase();
	var tid = req.body.tid;
	
	user.addTrip(username, tid, function(wasSuccessful) {
		if (wasSuccessful) {
			console.log(username1 + ' is going on trip ' + tid +'.');
			return res.render('200', {message: 'Successfully added trip to user!'});
		} else {
			req.flash('error', 'Could not add trip to user.');
			return res.redirect('/');
		}
	});
};

exports.getPhotos = function (req, res) {
	var username = req.params.username.toLowerCase();
	photo.forUser(username, function(err, photos) {
		if (err || !photos || photos.length === 0) {
			console.log('Photos not found.', err);
			return res.redirect('/');
		}
        return res.render('photos', {
            photos: photos
        });
	});
}

