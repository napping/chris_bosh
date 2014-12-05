var express = require('express');
require('./config/db');
var app = express();

require('./app/init')(app);

// TODO Experimental
app.set( "view engine", "ejs" );

app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

app.use(express.static("public"));

