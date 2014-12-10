var db = require('../../config/db'),
    user = require('./user'),
    _ = require('underscore'),
	oracle = require('oracle');


exports.create = function(name, privacy, username, cb) {
	var stmt = 'INSERT INTO Album (name, privacy, username) ' + 
		'VALUES (:1, :2, :3) ' +
		'RETURNING aid INTO :4 ';

    console.log(name, privacy, username);
	 // db.connection.execute("INSERT INTO Album (name, privacy, username) VALUES (\'blah\', \'public\', \'rigel\')", [], function(err, results) {
    db.connection.execute(stmt, [ name, privacy, username, new oracle.OutParam() ], function(err, results) {
		if (err || !results) {
            console.log(" error with db query ", err);
			cb(err, null);
		} else {
			var aid = results.returnParam;
			console.log(username + " successfully created Album called " + name + " with privacy " + privacy + " and id " + aid + ".");
            console.log(results);
            cb(err, aid, name);
		}
	});
}

// takes in album aid, outputs an object with data
exports.load = function(aid, cb) {
	var stmt = 'SELECT * FROM Album A WHERE A.aid = :1 '; 

	db.connection.execute(stmt, [aid], function(err, results) {
		if (err || !results) {
			cb(err, null);
		} else if (results.length === 0) {
			cb('Not a valid album.', null);
		} else {
			cb(err, results[0]);
		}
	});
};

exports.forUser = function(username, cb) {
    var stmt =  " SELECT A.aid, A.name " +
                " FROM Album A " +
                " WHERE A.username = :1 "+
                " ORDER BY A.aid ";

	db.connection.execute(stmt, [username], function (err, results) {
		if (err) {
			cb(err, null);
		} else {
            console.log( "Found " + results.length + " albums for user " + username + ".");
            cb(null, results);
		}
	});
}

exports.verifyUser = function(username, aid, cb) { 
    var stmt =  " SELECT A.privacy, A.username " + 
                " FROM ALBUM A " +  
                " WHERE A.aid = :1 ";
    db.connection.execute(stmt, [aid], function (err, results) { 
        if (err) { 
            cb(err, null);
        } else { 
            var privacy = results[0].PRIVACY;
            var owner = results[0].USERNAME;
            switch (privacy) { 
                case "public":
                    cb(null, true);
                    break;
                case "private":
                    if (owner == username) { 
                        cb(null, true);
                    } else { 
                        cb(null, false);
                    }
                    break;
                case "sharedWithTripMembers":
                    var stmt2 = " SELECT U.username " + 
                                " FROM Users U " +  
                                " INNER JOIN GoesOn GO ON GO.username = U.username " +  
                                " INNER JOIN AlbumOfTrip AOT ON AOT.tid = GO.tid " +  
                                " WHERE AOT.aid = :1 ";
                    db.console.execute(stmt2, [aid], function (err, results) { 
                        if (err) { 
                            cb(err, null);
                        } else {
                            allowedUsernames = [];
                            console.log("Allowed usernames : ", results);
                            for (tripUser in results) { 
                                allowedUsernames.push(tripUser.USERNAME);
                            }
                            if (allowedUsernames.indexOf(username)) { 
                                err(null, true);
                            } else { 
                                err(null, false);
                            }
                        }
                    });
                    break;
                default:
                    cb(null, false);
                    break;
            }
        }
    });
}
