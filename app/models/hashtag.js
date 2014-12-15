var db = require('../../config/db'),
    user = require('./user'),
	oracle = require('oracle');

exports.addTag = function (tag, type, mid, cb) {
	var stmt0 =     ' SELECT 1 ' +
	                ' FROM Hashtag H ' +
	                ' WHERE H.tag = :1 ';

    console.log("starting addTag");
    db.connection.execute(stmt0, [tag], function(err, exists) {
        if (err) { 
            console.log("Could not add hashtag", err);
            cb(err);
        } else { 
            if (exists.length != 0 && exists[0]["1"] == 1) { 
                var stmt2 = ' INSERT INTO Describes (tag, mid, type) ' + 
                            ' VALUES (:1, :2, :3) ';
                db.connection.execute(stmt2, [ tag, mid, type ], function(err, results) {
                    if (err) { 
                        cb(err);
                    } else { 
                        cb(null);
                    }
                });
           } else {
                var stmt1 = ' INSERT INTO Hashtag (tag)' +
                            ' VALUES (:1) ';

                db.connection.execute(stmt1, [tag], function(err, results) {
                    if (err) { 
                        console.log("Could not add hashtag", err);
                        cb(err);
                    } else { 
                        var stmt2 = ' INSERT INTO Describes (tag, mid, type) ' + 
                                    ' VALUES (:1, :2, :3) ';

                        db.connection.execute(stmt2, [ tag, mid, type ], function(err, results) {
                            if (err) { 
                                console.log("Could not add hashtag to describes", err);
                                cb(err);
                            } else { 
                                cb(null);
                            }
                        });
                    }
                });
            }
        }
    });
}

exports.getAllByMedia = function (mid, cb) { 
	var stmt =  ' SELECT D.tag ' + 
                ' FROM Describes D ' +
                ' WHERE D.mid = :1 ';
 
	db.connection.execute(stmt, [mid], function (err, results) {
		if (err) {
            console.log("Could not get hashtags for media", mid);
			cb(err, null);
		} else {
            cb(null, results);
        }
    });
}

exports.searchPhotos = function (tag, username, cb) { 
    // get all public photos with hashtag
	var stmt =  ' SELECT P.pid, P.url ' + 
                ' FROM Photo P ' +
                ' INNER JOIN Media M ON M.mid = P.pid ' +
                ' INNER JOIN Describes D ON D.mid = M.mid ' +
                ' WHERE D.tag = :1 AND M.privacy = \'public\' ';

    var photos = [];
	db.connection.execute(stmt, [tag], function (err, results) {
		if (err) {
            console.log("Could not get Public photos for hashtag", tag, err);
			cb(err, null);
		} else {
            for (var i = 0; i < results.length; i++) { 
                photos.push({ pid: results[i].PID, url: results[i].URL });
            }

            // get all private photos with hashtag
            var stmt2 = ' SELECT P.pid, P.url ' + 
                        ' FROM Photo P ' +
                        ' INNER JOIN Media M ON M.mid = P.pid ' +
                        ' INNER JOIN Describes D ON D.mid = M.mid ' +
                        ' INNER JOIN Owns O ON O.mid = M.mid ' +
                        ' WHERE D.tag = :1 AND O.username = :2 AND M.privacy = \'private\' ';

            db.connection.execute(stmt2, [tag, username], function (err, results) {
                if (err) { 
                    console.log("Could not get Private photos for hashtag", tag);
                    cb(err, null);
                } else { 
                    for (var i = 0; i < results.length; i++) { 
                        photos.push({ pid: results[i].PID, url: results[i].URL });
                    }

                    cb(null, photos);
                }
            });
        }
    });
}

exports.searchDestinations = function (tag, username, cb) { 
    // get all public destinations with hashtag
	var stmt =  ' SELECT M.mid, D.name ' + 
                ' FROM Destination D ' +
                ' INNER JOIN Media M ON M.mid = D.did ' +
                ' INNER JOIN Describes D ON D.mid = M.mid ' +
                ' WHERE D.tag = :1 AND M.privacy = \'public\' ';

    var destinations = [];
	db.connection.execute(stmt, [tag], function (err, results) {
		if (err) {
            console.log("Could not get Public destinations for hashtag", tag);
			cb(err, null);
		} else {
            for (var i = 0; i < results.length; i++) { 
                destinations.push({ did: results[i].MID, name: results[i].NAME });
            }

            // get all private destinations with hashtag
            var stmt2 = ' SELECT M.mid, D.name' + 
                        ' FROM Destination D ' +
                        ' INNER JOIN Media M ON M.mid = D.did ' +
                        ' INNER JOIN Describes D ON D.mid = M.mid ' +
                        ' INNER JOIN Owns O ON O.mid = M.mid ' +
                        ' WHERE D.tag = :1 AND O.username = :2 AND M.privacy = \'private\' ';

            db.connection.execute(stmt2, [tag, username], function (err, results) {
                if (err) { 
                    console.log("Could not get Private destinations for hashtag", tag);
                    cb(err, null);
                } else { 
                    for (var i = 0; i < results.length; i++) { 
                        destinations.push({ did: results[i].MID, name: results[i].NAME });
                    }

                    cb(null, destinations);
                }
            });
        }
    });
}
