var oracle  = require('oracle');
var mongodb = require('mongodb');

var connectData = {
    hostname: "cis550mbr.ckhbkpcw3otl.us-west-2.rds.amazonaws.com",
    port: 1521,
    database: "penndb",
    user: "mbr",
    password: "thisisthewordtopass"
};

var self = this;
oracle.connect(connectData, function(err, connection) {
    if (err) {
        console.log("Error connecting to Oracle: ", err);
    } else {
        console.log("Successfully connected to Oracle. Brian will have a " +
            "glass of Franzia to celebrate.");
        self.connection = connection;
    }
});
mongodb.MongoClient.connect(
    "mongodb://mbr:thisisthewordtopass@ds063870.mongolab.com:63870/cis550-eight", function(err, db) {
    if (err) {
        console.log("Error connecting to Mongo: ", err);
    } else {
        console.log("Successfully connected to Mongo. Rigel will found a " +
            "metal band to celebrate.");
        self.cache = db;
    }
});