var trip = require('../models/trip');
var comment = require('../models/comment');
var user = require('../models/user');
var album = require('../models/album');
var destination = require('../models/destination')

var _ = require('underscore');

exports.show = function(req, res) {
    trip.load(req.params.id, function(err, currTrip) {
        if (err || !currTrip) {
            console.log('Trip ' + req.params.id + ' not found.', err);
            return res.redirect('/');
        }
        trip.usersOnTrip(currTrip.TID, function(err, attendees) {
            if (err || !attendees) {
                console.log('Could not load users attending '+
                            currTrip.TID + '.', err);
                return res.redirect('/');
            }
            trip.destinationsOnTrip(currTrip.TID, function(err, destinations) {
                if (err || !destinations) {
                    console.log('Could not load destinations on ' +
                                currTrip.TID + '.', err);
                    return res.redirect('/');
                }
                trip.tripRequests(currTrip.TID, function(err, requests) {
                    if (err || !requests) {
                        console.log('Could not load trip requests on ' +
                                    currTrip.TID + '.', err);
                        return res.redirect('/');
                    }
                    comment.forTrip(currTrip.TID, function(err, comments) {
                        if (err || !comments) {
                            console.log('Could not load comments and ratings for trip ' +
                                        currTrip.TID + '.', err);
                            return res.redirect('/');
                        } else {
                            user.friends(currTrip.OWNER, function(err, friends) {
                                if (err || !friends) {
                                    console.log('Could not load invitation candidates on ' +
                                                currTrip.TID + '.' + err);
                                    return res.render('/');
                                } else {
                                    var albumsTrip = [];
                                    album.forTrip(currTrip.TID, function(err, foundAlbumsTrip) { 
                                        if (err) { 
                                            console.log("error getting trip albums : ", err);
                                            return res.redirect('/');
                                        } else { 
                                            albumsTrip = foundAlbumsTrip;
                                            if (typeof(req.session.username) != "undefined" && currTrip.OWNER == req.session.username.toLowerCase()) {

                                                var albumsUser = [];
                                                album.forUser(req.session.username, function(err, foundAlbumsUser) { 
                                                    if (err) { 
                                                        return res.redirect('/');
                                                    } else { 
                                                    	destination.forTrip(req.session.username, function(err, allDestinations) {
                                                    		if (err) {
                                                    			return res.redirect('/');
                                                    		} else {
																albumsUser = foundAlbumsUser;
		                                                        var attendeeNames = _.map(attendees, function(f) { return f.USERNAME; });
		                                                        var destinationIds = _.map(destinations, function(f) { return f.did; });
		                                                        return res.render('trips', {
		                                                            trip: currTrip,
		                                                            tid: currTrip.TID,
		                                                            attendees: attendeeNames,
		                                                            destinations: destinations,
		                                                            destinationsNotOnTrip: _.filter(allDestinations, function(f) { return destinationIds.indexOf(f.DID) === -1; }),
		                                                            invitationCandidates: _.filter(friends, function(f) { return attendeeNames.indexOf(f.USERNAME) === -1; }),
		                                                            requests: requests,
		                                                            comments: comments,
		                                                            partials: {
		                                                                destination: 'partials/trips'
		                                                            },
		                                                            albumsTrip: albumsTrip,
		                                                            albumsUser: albumsUser,
		                                                        });
                                                    		}
                                                    	})
                                                    }
                                                });
                                            } else {
                                                return res.render('trips', {
                                                    trip: currTrip,
                                                    tid: currTrip.TID,
                                                    attendees: _.map(attendees, function(f) { return f.USERNAME; }),
                                                    destinations: destinations,
                                                    requests: requests,
                                                    comments: comments,
                                                    partials: {
                                                        destination: 'partials/trips'
                                                    },
                                                    albumsTrip: albumsTrip,
                                                    albumsUser: [],   // template will see this and not render a select option 
                                                });
                                            }
                                        }
                                    });
                                }
                            });
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

exports.inviteUser = function(req, res) {
	var tid = req.params.id;
	var username = req.body.username.toLowerCase();
	var currUser = req.session.username.toLowerCase();

	trip.load(tid, function(err, tripObj) {
		if (err || !tripObj || tripObj.length === 0) {
			console.log('Trip ' + tid + ' could not be loaded.');
			return res.redirect('/');
		}
		if (tripObj.OWNER != currUser) {
			console.log('Could not send invitation for trip ' + tid + '.');
			return res.redirect('/trips/' + tid);
		}
		trip.sendInvitation(tid, currUser, username, function(err) {
			if (!err) {
				console.log(currUser + ' invited ' + username + ' to go on trip ' + tid + '.');
				return res.redirect(req.header('Referer') || '/');
			} else {
				console.log('Could not invite ' + username + ' to trip ' + tid + '.');
				req.flash('error', 'Could not invite user to trip.');
				return res.redirect(req.header('Referer') || '/');
			}
		});
	});
}

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

exports.acceptInvitation = function (req, res) {
	var currUser = req.session.username.toLowerCase();
	var tid = req.params.id;

	trip.load(tid, function(err, tripObj) {
		if (err || !tripObj || tripObj.length === 0) {
			console.log('Trip ' + tid + ' could not be loaded.');
			return res.redirect('/');
		}
		user.tripInvitations(currUser, function(err, invitations) {
			if (err || !invitations) {
				console.log('Could not load trip invitations.');
				return res.redirect(req.header('Referer') || '/');
			} else {
				var invitation_tids = _.map(invitations, function (f) { return f.TID });
				if (invitation_tids.indexOf(Number(tid)) === -1) {
					console.log('User not invited on this trip.');
					return res.redirect(req.header('Referer') || '/');
				}
				else {
							trip.addAttendee(tid, currUser, function(err, results) {
								if (err) {
									console.log('Could not add user to trip.');
									return res.redirect(req.header('Referer') || '/');
								} else {
								trip.deleteTripInvitation(tid, currUser, function(err) {
									if (err) {
										console.log('Could not remove trip invitation.');
										return res.redirect(req.header('Referer') || '/');
									} else {
										console.log(currUser + ' is on now trip ' + tid + '.');
										return res.redirect(req.header('Referer') || '/');
									}
								});
							}
					});
				}
			}
		});
	});
}

exports.acceptRequest = function(req, res) {
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
		//add check for request
		trip.addAttendee(tid, username, function(err, results) {
			if (err) {
				console.log('Could not add ' + username + ' to trip ' + tid + '.');
				req.flash('error', 'Could not add user to trip.');
				return res.redirect(req.header('Referer') || '/');
			} else {
				trip.deleteTripRequest(tid, username, function(deleted) {
					if (!deleted) {
						console.log('Could not delete request by ' + username + ' for trip ' + tid + '.');
						req.flash('error', 'Could not remove trip request.'); 
					}
					else {
						console.log(username + ' is on now trip ' + tid + '.');
						return res.redirect(req.header('Referer') || '/');
					}

				});
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
			console.log('Could not decline request for trip ' + tid + '.');
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

exports.declineInvitation = function (req, res) {
	var currUser = req.session.username.toLowerCase();
	var tid = req.params.id;

	user.tripInvitations(currUser, function(err, invitations) {
		if (err || !invitations) {
			console.log('Could not load trip invitations.');
			return res.redirect(req.header('Referer') || '/');
		} else {
			if (_.map(invitations, function (f) { return f.TID }).indexOf(Number(tid)) === -1) {
				console.log('User not invited on this trip');
				return res.redirect(req.header('Referer') || '/');
			}
			trip.deleteTripInvitation(tid, currUser, function(deleted) {
				if (!deleted) {
					console.log('Could not decline the invitation of ' + currUser + ' for trip ' + tid + '.');
					return res.redirect(req.header('Referer') || '/');
				} else {
					console.log(currUser + '\'s invitation to be on trip ' + tid + ' was declined.');
					return res.redirect(req.header('Referer') || '/');
				}
			});
		}
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

exports.comment = function(req, res) {
	if (req.session.username) {
		return res.render('trip_comment', {
			id: req.params.id
		});
 	} else {
		return res.redirect('/trips/' + req.params.id);
	}
}

exports.addComment = function(req, res) {
	var username = req.session.username.toLowerCase();
	var tid = req.params.id;
	var review = req.body.review;
	var rating = req.body.rating;
	comment.create(username, tid, 'Trip', review, rating, function(wasSuccessful) {
		if (!wasSuccessful) {
			console.log(username + ' could not leave comment for trip ' + tid + '.');
		}
		return res.redirect('/trips/' + tid);
	});
}

exports.addAlbum = function(req, res) {
	var tid = req.body.tid;
	var aid = req.body.aid;
    album.addToTrip(aid, tid, function(err) {
        if (err) { 
            console.log("Could not add album ", aid, " to trip ", tid, ".");
        }
		return res.redirect('/trips/' + tid);
	});
}

exports.addDestination = function(req, res) {
	var tid = req.params.id;
	var did = req.body.did;
	var currUser = req.session.username.toLowerCase();

	console.log(req.body);

	trip.load(tid, function(err, tripObj) {
		if (err || !tripObj || tripObj.length === 0) {
			console.log('Trip ' + tid + ' could not be loaded.');
			return res.redirect('/');
		}
		if (tripObj.OWNER != currUser) {
			console.log('Could not add destination ' + did + ' to trip ' + tid + '.');
			return res.redirect('/trips/' + tid);
		}
		trip.destinationsOnTrip(tid, function(err, destinations) {
			if (err || !destinations) {
				console.log('Could not load destinations on ' +
					tid + '.', err);
				return res.redirect('/trips/' + tid);
			}
			trip.addDestination(tid, did, destinations.length, function(err) {
				if (err) {
					console.log('Could not add destination ' + did + ' to trip ' + tid + '.');
					return res.redirect('/trips/' + tid);
				}
				else {
					console.log('Added destination ' + did + ' to trip ' + tid + '.');
					return res.redirect('/trips/' + tid);
				}
			});
		});
	});
}


