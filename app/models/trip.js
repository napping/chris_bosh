var db = require('../../config/db'),
	oracle = require('oracle');

exports.load = function(tid, cb) {
	var stmt = 'SELECT T.tid, T.name, T.expenses, T.packing_list, O.username as owner, M.privacy as privacy FROM Trip T ' +
		'INNER JOIN Media M ON T.tid = M.mid AND T.type = M.type ' +
		'INNER JOIN Owns O ON O.mid = M.mid AND M.source = O.source AND M.type = O.type ' + 
		'WHERE T.tid = :1';
	db.connection.execute(stmt, [tid], function(err, results) {
		cb(err, results[0]);
	});
};

exports.create = function(username, name, packing_list, expenses, cb) {
	var stmt = 'INSERT INTO Media (type, privacy) ' + 
		'VALUES (\'Trip\', \'public\') ' +
		'RETURNING MID INTO :1';
	db.connection.execute(stmt, [new oracle.OutParam()], function(err, results) {
		if (err || !results) {
			cb(err, []);
		} else {
			var tid = results.returnParam;
			var stmt2 = 'INSERT INTO Owns (username, mid, type) VALUES ' +
						'(:1, :2, \'Trip\')';

			db.connection.execute(stmt2, [username, tid], function(err, results2) {
				if (err || !results2) {
					cb(err, []);
				} else {
					var stmt3 = "INSERT INTO Trip (tid, name, packing_list, expenses) " +
									"VALUES (:1, :2, :3, :4)";
					db.connection.execute(stmt3, [tid, name, packing_list, expenses], function(err, results3) {
						if (err || !results3) {
							cb(err, []);
						}
						else {
							var stmt4 = "INSERT INTO GoesOn (username, tid) " +
										"VALUES (:1, :2)";
							db.connection.execute(stmt4, [username, tid], function(err, results4) {
							// We should never really expect an error to occur here.
								cb(err, tid);
							});
						}
					});
				}
			});
		}
	});
}

exports.tripRequests = function(tid, cb) {
	var stmt = 'SELECT username FROM RequestTrip WHERE tid=:1';
	db.connection.execute(stmt, [tid], function(err, results) {
		if (err) {
			cb(err, null);
		} else {
			cb(null, results);
		}
	});
}

exports.friendRequests = function(username, cb) {
	var stmt = 'SELECT requester FROM FriendRequest WHERE requestee=:1';
	db.connection.execute(stmt, [username.toLowerCase()], function(err, results) {
		if (err) {
			cb(err, null);
		} else {
			cb(null, results);
		}
	});
};


exports.save = function(tid, name, packing_list, expenses, cb) {
	var stmt = 'UPDATE Trip SET name=:1, packing_list=:2, expenses=:3 ' + 
			   'WHERE tid=:4';
	db.connection.execute(stmt, [name, packing_list, expenses, tid], function(err, results) {
		if (err) {
			cb(err);
		} else {
			cb(null);
		}
	});
}

exports.usersOnTrip = function(tid, cb) {
	var stmt = 'SELECT G.username FROM GoesOn G ' +
			   'INNER JOIN Trip T ON T.tid = G.tid ' +
			   'WHERE G.tid = :1';
	db.connection.execute(stmt, [tid], function(err, results) {
		cb(err, results);
	});
}

exports.destinationsOnTrip = function(tid, cb) {
	var stmt = 'SELECT D.did, D.name FROM PartOf P ' +
			   'INNER JOIN Trip T ON T.tid = P.tid ' +
			   'INNER JOIN Destination D ON D.did = P.did ' +
			   'WHERE T.tid = :1';
	db.connection.execute(stmt, [tid], function(err, results) {
		cb(err, results);
	});	
}

exports.sendInvitation = function (tid, inviter, invitee, cb) {
	var stmt = 'INSERT INTO InviteTrip (username1, username2, tid) VALUES (:1, :2, :3)';
	db.connection.execute(stmt, [inviter, invitee, tid], function(err, results) {
		if (err) {
			console.log(err);
			cb(true);
		} else {
			cb(false);
		}
	});	
}

exports.requestTrip = function(tid, username, cb) {
	var stmt = 'INSERT INTO RequestTrip (tid, username) VALUES (:1, :2)';
	db.connection.execute(stmt, [tid, username], function(err, results) {
		if (err) {
			cb(false);
		} else {
			cb(true);
		}
	});
};
exports.addAttendee = function(tid, username, cb) {
	exports.requestPending(username, tid, function(pending) {
		exports.invitationPending(username, tid, function(invited) {
			if (!pending && !invited) {
			cb('No trip request pending and not invited.', null);
			} else {
				var stmt3 = 'INSERT INTO GoesOn(username, tid) VALUES (:1, :2)';
				db.connection.execute(stmt3, [username, tid], function(err, results) {
					if (err) {
						cb(err, null);
					} else if (results.length === 0) {
						cb('Already on this trip.', null);
					} else {
						cb(null, results)
					} 
				});
			}
		});	
	});
}

exports.deleteTripRequest = function(tid, username, cb) {
	var stmt = 'DELETE FROM RequestTrip WHERE tid=:1 AND username=:2';
	db.connection.execute(stmt, [tid, username], function(err, results) {
		if (err) {
			console.log(err);
			return cb(false);
		} else {
			return cb(true);
		}
	});
};

exports.deleteTripInvitation = function(tid, invitee, cb) {
	var stmt = 'DELETE FROM InviteTrip WHERE tid=:1 AND username2=:2';
	db.connection.execute(stmt, [tid, invitee], function(err, results) {
		return cb(!err);
	});
};

exports.removeAttendee = function(tid, username, cb) {
	var stmt = 'DELETE FROM GoesOn WHERE username=:1 AND tid=:2'
	db.connection.execute(stmt, [username, tid], function(err, results) {
		if (err) {
			cb(err);
		} else if (results.length === 0) {
			cb('User was not on trip to begin with.');
		} else {
			cb(null);
		}
	});		   
};

exports.requestPending = function(username, tid, cb) {
	var stmt = 'SELECT * FROM RequestTrip WHERE username=:1 AND tid=:2';
	db.connection.execute(stmt, [username, tid], function(err, results) {
		if (err) {
			cb(false);
		} else if (results.length === 0) {
			cb(false);
		} else {
			cb(true);
		}
	});
};


exports.invitationPending = function(username, tid, cb) {
	var stmt = 'SELECT * FROM InviteTrip WHERE username2=:1 AND tid=:2';
	db.connection.execute(stmt, [username, tid], function(err, results) {
		if (err) {
			cb(false);
		} else if (results.length === 0) {
			cb(false);
		} else {
			cb(true);
		}
	});
};

exports.onTrip = function(tid, username, cb) {
	var stmt = 'SELECT * FROM GoesOn WHERE tid=:1 AND username=:2';
	db.connection.execute(stmt, [tid, username], function(err, results) {
		if (err || results.length === 0) {
			cb(false);
		} else {
			cb(true);
		}
	});	
}

exports.forDestination = function(curDest, curUser, cb) {
	var stmt = 'SELECT DISTINCT T.tid, T.name, M.privacy FROM Trip T ' + 
			   'INNER JOIN PartOf P on P.tid = T.tid ' +
			   'INNER JOIN Destination D on P.did = D.did ' +
			   'INNER JOIN Media M ON M.mid = T.tid AND M.type = T.type AND M.source = T.source ' +
			   'INNER JOIN Owns O ON O.mid = M.mid AND M.source = O.source AND M.type = O.type ' +
			   'WHERE D.did=:1';
	db.connection.execute(stmt, [curDest], function(err, results) {
		if (err) {
			cb(err, null);
		}
		var trips = [];
		if (curUser) {
			for (var i = 0; i < results.length; i++) {
				if (results[i].PRIVACY === 'public') {
					trips.push(results[i]);
				} else if (results[i].PRIVACY === 'sharedWithTripMembers' && curUser &&
					(onTrip.indexOf(curUser) !== -1 || curUser === results[i].OWNER)) {
					trips.push(results[i]);
				}
				else if (results[i].PRIVACY === 'private' && curUser && curUser == results[i].OWNER) {
					trips.push(results[i]);
				}
			}
		} else {
			for (var i = 0; i < results.length; i++) {
				if (results[i].PRIVACY === 'public') {
					trips.push(results[i]);
				} 
			}
		}
		cb(null, trips)
		
	});
}