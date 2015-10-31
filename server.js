// BASE SETUP
// =============================================================================

var express = require('express');
var app        = express();
var bodyParser = require('body-parser');
var logger = require('morgan');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger('dev'));

//Set up  CORS headers
app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    // Set custom headers for CORS
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});

//config database
var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost/testBear'); // connect to local database
//mongoose.connect('mongodb://node:node@novus.modulusmongo.net:27017/Iganiq8o');

//include routing
app.use('/', require('./app/routes'));
// If no route is matched by now, it must be a 404
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// START THE SERVER
// =============================================================================
// Start the server
app.set('port', process.env.PORT || 8080);
var server = app.listen(app.get('port'), function() {
    console.log('Magic happens on port ' + server.address().port);
});
