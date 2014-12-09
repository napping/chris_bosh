var db = require('../../config/db'),
    user = require('./user'),
	oracle = require('oracle');

exports.load = function(did, cb) {
	var stmt = 'SELECT * FROM Destination D ' +
		'INNER JOIN Media M ON D.did = M.mid AND D.type = M.type ' +
		'WHERE D.did = :1 AND D.source=\'default\'';

	db.connection.execute(stmt, [did], function(err, results) {
		if (err || !results) {
			cb(err, null);
		} else if (results.length === 0) {
			cb('Not a valid destination.', null);
		} else {
			cb(err, results[0]);
		}
	});
};

exports.create = function(name, username, cb) {
	var stmt = 'INSERT INTO Media (type, privacy) ' + 
		'VALUES (\'Destination\', \'public\')' +
		'RETURNING MID INTO :1';
	db.connection.execute(stmt, [new oracle.OutParam()], function(err, results) {
		if (err || !results) {
			cb(err, null);
		} else {
			console.log(username);
			console.log(did);
			var did = results.returnParam;
			var stmt2 = 'INSERT INTO Owns (username, mid, type) VALUES ' +
				'(:1, :2, \'Destination\')';
			db.connection.execute(stmt2, [username, did], function (err, results) {
				if (err) {
					cb(err, null);
				} else {
					var stmt3 = 'INSERT INTO Destination (did, name) VALUES (:1, :2)';
					db.connection.execute(stmt3, [did, name], function(err, results) {
						// We should never really expect an error to occur here.
						cb(err, did, name);
					});
				}
			});
		}
	});
}

exports.forUser = function(username, curUser, cb) {
	var stmt = 'SELECT DISTINCT D.did, D.name, O.username AS owner, M.privacy FROM Destination D ' +
			   'INNER JOIN PartOf P ON P.did = D.did ' +
			   'INNER JOIN GoesOn G ON P.tid = G.tid ' +
			   'INNER JOIN Users U ON U.username = G.username ' +
			   'INNER JOIN Media M ON M.mid = D.did AND M.type = D.type AND M.source = D.source ' +
			   'INNER JOIN Owns O ON O.mid = M.mid AND M.source = O.source AND M.type = O.type ' + 
			   'WHERE U.username = :1';
	db.connection.execute(stmt, [username], function (err, results) {
		if (err) {
			cb(err, null);
		} else {
			user.friends(curUser, function(err, friends) {
				if (err) {
					cb(err, null);
				} else {
					var destinations = [];
					friends = _.map(friends, function(f) { return f.USERNAME.toLowerCase(); });
					for (var i = 0; i < results.length; i++) {
						if (results[i].PRIVACY === 'public') {
							destinations.push(results[i]);
						} else if (results[i].PRIVACY === 'sharedWithTripMembers' && 
							(friends.indexOf(curUser) !== -1 || curUser === results[i].OWNER)) {
							destinations.push(results[i]);
						} else if (results[i].PRIVACY === 'private' && curUser === results[i].OWNER) {
							destinations.push(results[i]);
						}
					}
				}
				cb(null, destinations);
			});
		}
	});
}