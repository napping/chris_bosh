var db   = require('../../config/db');
var user = require('./user');
var _    = require('underscore');

exports.load = function(username, cb) {
	var stmt = 'SELECT username, full_name, affiliation, interests FROM ' + 
		'Users WHERE username=:1';
	db.connection.execute(stmt, [username], function(err, results) {
		if (err) {
			cb(err, null);
		} else if (results.length === 0) {
			cb('No such user.', null);
		} else {
			cb(null, results);
		}
	});
}

// Please make sure that username is lowercase.
exports.isValidLogin = function(username, password, cb) {
		var stmt = 'SELECT username FROM Users WHERE username=:1 AND password=:2';
		db.connection.execute(stmt, [username, password], function(err, results) {
				if (err) {
					cb(false);
				} else {
					cb(results.length === 1 && results[0].USERNAME.toLowerCase() === username);
				}
		});
};

exports.register = function(username, password, email, fullName, cb) {
	var stmt = 'INSERT INTO Users (username, password, email, full_name) ' +
		'VALUES (:1, :2, :3, :4)';
	db.connection.execute(stmt, [username, password, email, fullName], function(err, results) {
		if (err) {
			cb(err);
		} else {
			cb(null);
		}
	});
};

exports.friends = function(username, cb) {
	if (!username) {
		cb(null, []);
	} else {
		var stmt = '(SELECT F.username2 as username FROM Friendship F WHERE username1=:1) ' + 
					'UNION ' +
					 '(SELECT F.username1 as username FROM Friendship F WHERE username2=:1)';
		db.connection.execute(stmt, [username], function(err, results) {
			cb(err, results);
		});
	}
}

exports.addFriend = function(username1, username2, cb) {
	var stmt = 'INSERT INTO Friendship(username1, username2) VALUES (:1, :2)';
	db.connection.execute(stmt, [username1, username2], function(err, results) {
		if (err) {
			cb(err, null);
		} else if (results.length === 0) {
			cb('Already friends with this user.', null);
		} else {
			cb(null, results)
		} 
	});
}

exports.removeFriend = function(username1, username2, cb) {
	var stmt = 'DELETE FROM Friendship WHERE ' +
				 '(username1=:1 AND username2=:2) OR ' +
				 '(username2=:1 AND username1=:2)'
	db.connection.execute(stmt, [username1, username2], function(err, results) {
		if (err) {
			cb(err);
		} else if (results.length === 0) {
			cb('Users were not friends to begin with.');
		} else {
			cb(null);
		}
	});		   
}

exports.getTrips = function(username, cb) {
	var stmt = 'SELECT T.tid, T.name FROM Trip T ' +
			   'INNER JOIN GoesOn G on T.tid = G.tid ' +
			   'WHERE G.username=:1';
	db.connection.execute(stmt, [username], function(err, results) {
		cb(err, results);
	});
}

exports.addTrip = function(username, tid, cb) {
	var stmt = 'INSERT INTO GoesOn (username, tid) VALUES (:1, :2)';
	db.connection.execute(stmt, [username, tid], function(err, results) {
		if (err) {
			cb(false);
		} else {
			cb(results.updatecount === 1);
		}
	});
};

// This is going to be hard to debug without more data.
exports.forDestination = function(did, curUser, cb) {
	var stmt = 'SELECT DISTINCT U.username AS username, M.privacy AS privacy, ' +
		'O.username AS owner FROM Users U ' +
		'INNER JOIN GoesOn G ON U.username = G.username ' +
		'INNER JOIN Trip T ON T.tid = G.tid AND T.source = G.source ' +
		'INNER JOIN PartOf P ON P.tid = T.tid AND P.source = T.source ' +
		'INNER JOIN Destination D ON P.did = D.did AND P.source = D.source ' +
		'INNER JOIN Media M ON M.mid = D.did AND M.type = D.type AND M.source = D.source ' +
		'INNER JOIN Owns O ON O.mid = M.mid AND M.source = O.source AND M.type = O.type ' +
		'WHERE D.did=:1';
	db.connection.execute(stmt, [did], function(err, results) {
		if (err) {
			cb(err, null);
		} else {
			exports.friends(curUser, function(err, friends) {
				if (err) {
					cb(err, null);
				} else {
					var users = [];
					friends = _.map(friends, function(f) { return f.USERNAME.toLowerCase(); });
					for (var i = 0; i < results.length; i++) {
						if (results[i].PRIVACY === 'public') {
							users.push(results[i].USERNAME);
						} else if (results[i].PRIVACY === 'sharedWithTripMembers' && 
							(friends.indexOf(curUser) !== -1 || curUser === results[i].OWNER)) {
							users.push(results[i].USERNAME);
						} else if (results[i].PRIVACY === 'private' && curUser === results[i].OWNER) {
							users.push(results[i].USERNAME);
						}
					}
				}
				cb(null, users);
			});
		}
	});
}
