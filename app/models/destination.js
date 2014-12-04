var db = require('../../config/db'),
	oracle = require('oracle');

exports.load = function(did, cb) {
	var stmt = 'SELECT * FROM Destination D ' +
		'INNER JOIN Media M ON D.did = M.mid AND D.type = M.type' +
		'WHERE D.did = :1 AND D.source=\'default\'';

	db.connection.execute(stmt, [did], function(err, results) {
		cb(err, results[0]);
	});
};

exports.create = function(name, cb) {
	var stmt = 'INSERT INTO Media (type, privacy) ' + 
		'VALUES (\'Destination\', \'public\')' +
		'RETURNING MID INTO :1';
	db.connection.execute(stmt, [new oracle.OutParam()], function(err, results) {
		if (err || !results) {
			cb(err, []);
		} else {
			var stmt2 = 'INSERT INTO Destination (did, name) VALUES (:1, :2)';
			db.connection.execute(stmt2, [results.returnParam, name], function(err, results) {
				// We should never really expect an error to occur here.
				cb(err, results);
			});
		}
	});
}