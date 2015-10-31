var express = require('express');
var router = express.Router();
var auth = require('./auth.js');
var bears = require('./bears.js');

// Test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});


// Routes that can be accessed by any one
router.post('/login', auth.login);

//Routes that can be accessed only by autheticated users
router.get('/api/bears', bears.getAll);
router.get('/api/bears/:id', bears.getOne);
router.post('/api/bears/', bears.create);
router.put('/api/bears/:id', bears.update);
router.delete('/api/bears/:id', bears.delete);

module.exports = router;
