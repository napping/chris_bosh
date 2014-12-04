var oracle = require('oracle');

var connectData = {
    hostname: "cis550mbr.ckhbkpcw3otl.us-west-2.rds.amazonaws.com",
    port: 1521,
    database: "penndb",
    user: "mbr",
    password: "thisisthewordtopass"
};

oracle.connect(connectData, function(err, connection) {
    if (err) {
        console.log("Error connecting to Oracle: ", err);
        return;
    } else {
        console.log("Successfully connected to Oracle. Brian will have a " +
            "glass of Franzia to celebrate.");
    }
});
