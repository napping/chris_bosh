var db = require('../../config/db');

// Please make sure that username is lowercase.
exports.isValidLogin = function(username, password, cb) {
    var stmt = 'SELECT username FROM Users WHERE username=:1 AND password=:2';
    db.connection.execute(stmt, [username, password], function(err, results) {
        if (err) {
        	cb(false);
        } else {
        	cb(results.length === 1 && results[0].USERNAME.toLowerCase() === username);
        }
    });
};

exports.register = function(username, password, email, fullName, cb) {
	var stmt = 'INSERT INTO Users (username, password, email, full_name) ' +
		'VALUES (:1, :2, :3, :4)';
	db.connection.execute(stmt, [username, password, email, fullName], function(err, results) {
		if (err) {
			cb(false);
		} else {
			cb(results.updateCount === 1);
		}
	});
}