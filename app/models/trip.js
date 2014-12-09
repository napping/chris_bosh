var db = require('../../config/db'),
	oracle = require('oracle');

exports.load = function(tid, cb) {
	var stmt = 'SELECT * FROM Trip T ' +
		'INNER JOIN Media M ON T.tid = M.mid AND T.type = M.type ' +
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