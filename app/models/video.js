var db = require('../../config/db'),
    user = require('./user'),
	oracle = require('oracle'),
	request = require('request');

exports.create = function(url, username, cb) {
	var stmt = 'INSERT INTO Media (type, privacy) ' + 
		'VALUES (\'Video\', \'public\')' +
		'RETURNING MID INTO :1';
	db.connection.execute(stmt, [new oracle.OutParam()], function(err, results) {
		if (err || !results) {
			cb(err, null);
		} else {
			var vid = results.returnParam;
			var stmt2 = 'INSERT INTO Owns (username, mid, type) VALUES ' +
				'(:1, :2, \'Video\')';
			db.connection.execute(stmt2, [username, vid], function (err, results) {
				if (err) {
					cb(err, null);
				} else {
                    console.log(url, vid, username);
					var stmt3 = 'INSERT INTO Video (vid, url) VALUES (:1, :2)';
					db.connection.execute(stmt3, [vid, url], function(err, results) {
						// We should never really expect an error to occur here.
						cb(err, vid, url);
					});
				}
			});
		}
	});
}

exports.forUser = function(username, cb) { 
    var stmt =  " SELECT V.vid, V.url " +
                " FROM Video V " +
                " INNER JOIN Media M ON M.mid = V.vid AND M.type = \'Video\' "+
                " INNER JOIN Owns O ON O.mid = M.mid AND O.type = \'Video\' "+
                " WHERE O.username = :1 "+
                " ORDER BY V.vid ";

	db.connection.execute(stmt, [username], function (err, results) {
		if (err) {
            console.log(err);
			cb(err, null);
		} else {
            console.log( "Found " + results.length + " videos for user " + username + ".");
            cb(null, results);
		}
	});
}
