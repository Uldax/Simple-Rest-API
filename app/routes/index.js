var express = require('express');
var router = express.Router();
var auth = require('./auth.js');
var bears = require('./bears.js');

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    //  We can do validations to make sure that everything coming from a request is safe and sound.
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// all of our routes will be prefixed with /api
//app.use('/api', router);

/*
* Routes that can be accessed by any one
*/
router.post('/login', auth.login);
/*
* Routes that can be accessed only by autheticated users
*/
router.get('/api/v1/bears', bears.getAll);
router.get('/api/v1/bears/:id', bears.getOne);
router.post('/api/v1/bears/', bears.create);
router.put('/api/v1/bears/:id', bears.update);
router.delete('/api/v1/bears/:id', bears.delete);

module.exports = router;
