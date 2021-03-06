var db = require('../../config/db'),
	oracle = require('oracle');

exports.forTrip = function(tid, cb) {
	var stmt = 'SELECT * FROM Rating R WHERE mid=:1 AND type=\'Trip\'';
	db.connection.execute(stmt, [tid], function(err, ratings) {
		if (err) {
			cb(err, null);
		} else {
			cb(null, ratings);
		}
	});
};

exports.forPhoto = function(pid, cb) {
	var stmt = 'SELECT * FROM Rating R WHERE mid=:1 AND type=\'Photo\'';
	db.connection.execute(stmt, [pid], function(err, ratings) {
		if (err) {
			cb(err, null);
		} else {
			cb(null, ratings);
		}
	});
};

exports.create = function(username, mid, type, review, rating, cb) {
	if (rating) {
		var stmt = 'INSERT INTO Rating (username, mid, type, review, rating) ' +
			'VALUES (:1, :2, :3, :4, :5)';
		db.connection.execute(stmt, [username, mid, type, review, rating], function(err, results) {
			cb(!err);
		});
	} else {
		var stmt = 'INSERT INTO Rating (username, mid, type, review) ' +
			'VALUES (:1, :2, :3, :4)';
		db.connection.execute(stmt, [username, mid, type, review], function(err, results) {
			cb(!err);
		});
	}
};