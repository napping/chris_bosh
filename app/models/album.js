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


