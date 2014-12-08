var db = require('../../config/db'),
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