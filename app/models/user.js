var db = require('../../config/db');

// Please make sure that email is lowercase.
exports.isValidLogin = function(email, password, cb) {
    var stmt = 'SELECT email FROM Users WHERE email=:1 AND password=:2';
    db.connection.execute(stmt, [email, password], function(err, results) {
        if (err) {
        	cb(false);
        } else if (results.length === 1 && results[0].EMAIL.toLowerCase() === email) {
        	cb(true);
        } else {
        	cb(false);
        }
    });
};
