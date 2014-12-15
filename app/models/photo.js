var db = require('../../config/db'),
    user = require('./user'),
	oracle = require('oracle'),
	request = require('request');

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

exports.createInAlbum = function(url, username, aid, privacy, cb) {
	var stmt = 'INSERT INTO Media (type, privacy) ' + 
		'VALUES (\'Photo\', :1)' +
		'RETURNING MID INTO :2';
	db.connection.execute(stmt, [privacy, new oracle.OutParam()], function(err, results) {
		if (err || !results) {
			cb(err, null);
		} else {
			var pid = results.returnParam;
			var stmt2 = 'INSERT INTO Owns (username, mid, type) VALUES ' +
				'(:1, :2, \'Photo\')';
			db.connection.execute(stmt2, [username, pid], function (err, results) {
				if (err) {
					cb(err, null);
				} else {
                    var stmt3 = 'INSERT INTO InAlbum (aid, mid, type) VALUES (:1, :2, \'Photo\')';
                    db.connection.execute(stmt3, [aid, pid], function (err, results) {
                        if (err) {
                            cb(err, null);
                        } else { 
                            var stmt4 = 'INSERT INTO Photo (pid, url) VALUES (:1, :2)';
                            db.connection.execute(stmt4, [pid, url], function(err, results) {
                                // We should never really expect an error to occur here.
                                cb(err, pid, url);
                            });

                        }
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
                " WHERE O.username = :1 "+
                " ORDER BY P.pid ";

	db.connection.execute(stmt, [username], function (err, results) {
		if (err) {
			cb(err, null);
		} else {
            console.log( "Found " + results.length + " photos for user " + username + ".");
            cb(null, results);
		}
	});
}

exports.forAlbum = function(aid, username, cb) {
    var stmt =  " SELECT P.pid, P.url " +
                " FROM Photo P " +
                " INNER JOIN Media M ON M.mid = P.pid AND M.type = \'Photo\' "+
                " INNER JOIN Owns O ON O.mid = M.mid AND O.type = \'Photo\' "+
                " INNER JOIN InAlbum IA ON IA.mid = M.mid AND IA.type = \'Photo\' "+
                " WHERE IA.aid = :1 "+
                " ORDER BY P.pid ";
	db.connection.execute(stmt, [aid], function (err, results) {
		if (err) {
			cb(err, null);
		} else {
            console.log( "Found " + results.length + " photos for album " + aid + ".");
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

exports.getUserProfile = function (username, cb) { 
    var stmt =  " SELECT * " +
                " FROM ( SELECT P.pid, P.url " +
                "       FROM Photo P " +
                "       INNER JOIN Media M ON M.mid = P.pid AND M.type = \'Photo\' "+
                "       INNER JOIN Owns O ON O.mid = M.mid AND O.type = \'Photo\' "+
                "       WHERE O.username = :1"+
                "       ORDER BY P.pid DESC"+
                " ) "+
                " WHERE ROWNUM = 1 ";

	db.connection.execute(stmt, [username], function (err, results) {
		if (err) {
			cb(err, null);
		} else {
            cb(null, results[0]);
		}
	});
}

exports.getOwner = function (pid, cb) { 
    var stmt =  " SELECT O.username " +
                " FROM Owns O " + 
                " WHERE O.mid = :1 AND O.type = \'Photo\'";

	db.connection.execute(stmt, [pid], function (err, results) {
        if (err) { 
            cb(err, null);
        } else { 
            cb(err, results[0].USERNAME);
        }
    });
}

exports.view = function(pid, cb) {
	var stmt = "UPDATE Photo SET hits = hits + 1 WHERE pid=:1";

	db.connection.execute(stmt, [pid], function (err, results) {
		if (err) {
			cb(err, false);
		}
		var stmt2 = "SELECT hits, url FROM Photo WHERE pid=:1";

		db.connection.execute(stmt2, [pid], function (err, results) {
			if (err) {
				cb(err, false);
			} else if (results.length === 1 && results[0].HITS === 5) {
				request({url: results[0].URL, encoding: null}, function (err, resp, body) {
					var collection = db.cache.collection('photos');
					collection.insert({pid: pid, image: body}, function(err) {
						if (err) {
							cb(err, false);
						} else {
							console.log('Cache entry added for photo ' + pid + '.');
							cb(null, true);
						}
					});
				});
			} else {
				cb(err, results.length === 1 && results[0].HITS >= 5);
			}
		});
	});
}

exports.fromCache = function (pid, cb) {
	var collection = db.cache.collection('photos');
	collection.findOne({pid: pid}, function(err, photo) {
		if (err) {
			cb(err, null);
		} else {
			cb(null, photo.image.buffer);
		}
	});
}