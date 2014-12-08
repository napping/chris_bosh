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

exports.create = function(name, packing_list, expenses, cb) {
	var stmt = 'INSERT INTO Media (type, privacy) ' + 
		'VALUES (\'Trip\', \'public\') ' +
		'RETURNING MID INTO :1';
	db.connection.execute(stmt, [new oracle.OutParam()], function(err, results) {
		if (err || !results) {
			cb(err, []);
		} else {
			var stmt2 = "INSERT INTO Trip (tid, name, packing_list, expenses) " +
						"VALUES (:1, :2, :3, :4)";
			db.connection.execute(stmt2, [results.returnParam, name, packing_list, expenses], function(err, results) {
				// We should never really expect an error to occur here.
				cb(err, results);
			});
		}
	});
}

exports.forDestination = function(currDest, cb) {
	var stmt = 'SELECT DISTINCT T.tid, T.name FROM Trip T ' + 
			   'INNER JOIN PartOf P on P.tid = T.tid ' +
			   'INNER JOIN Destination D on P.did = D.did ' +
			   'WHERE D.did = :1';
	db.connection.execute(stmt, [currDest], function(err, results) {
		cb(err, results);
	});
}