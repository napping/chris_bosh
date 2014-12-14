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
            if (!exists || exists.length == 0) { 
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
            } else {
                var stmt2 = ' INSERT INTO Describes (tag, mid, type) ' + 
                            ' VALUES (:1, :2, :3); ';
                db.connection.execute(stmt2, [ tag, mid, type ], function(err, results) {
                    if (err) { 
                        console.log("Could not add hashtag to describes", err);
                        cb(err);
                    } else { 
                        cb(null);
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
