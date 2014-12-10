var db = require('../../config/db'),
    user = require('./user'),
	oracle = require('oracle');

exports.create = function(url, username, cb) {
	var stmt = 'INSERT INTO Media (type, privacy) ' + 
		'VALUES (\'Photo\', \'public\')' +
		'RETURNING MID INTO :1';
	db.connection.execute(stmt, [new oracle.OutParam()], function(err, results) {
		if (err || !results) {
			cb(err, null);
		} else {
			console.log(username);
			var pid = results.returnParam;
			console.log(pid);
			var stmt2 = 'INSERT INTO Owns (username, mid, type) VALUES ' +
				'(:1, :2, \'Photo\')';
			db.connection.execute(stmt2, [username, pid], function (err, results) {
				if (err) {
					cb(err, null);
				} else {
                    console.log(url, pid, username);
					var stmt3 = 'INSERT INTO Photo (pid, url) VALUES (:1, :2)';
					db.connection.execute(stmt3, [pid, url], function(err, results) {
						// We should never really expect an error to occur here.
						cb(err, pid, url);
					});
				}
			});
		}
	});
}

exports.forUser = function(username, cb) {
    var stmt =  " SELECT P.pid, P.url " +
                " FROM Photo P " +
                " INNER JOIN Media M ON M.mid = P.pid AND M.type = \'Photo\' "+
                " INNER JOIN Owns O ON O.mid = M.mid AND O.type = \'Photo\' "+
                " WHERE O.username = :1 ";

	db.connection.execute(stmt, [username], function (err, results) {
		if (err) {
			cb(err, null);
		} else {
            cb(null, results);
		}
	});
}

exports.getUrlByID = function (pid, cb) { 
    var stmt = " SELECT P.url FROM Photo P WHERE P.pid = :1 ";
	db.connection.execute(stmt, [pid], function (err, results) {
		if (err) {
			cb(err, null);
		} else {
            cb(err, results[0].URL);
        }
    });
}















