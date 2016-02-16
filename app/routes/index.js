var express = require('express');
var router = express.Router();
var auth = require('./auth.js');
var googleAuth = require('./googleAuth.js');

var bears = require('./bears.js');
var users = require('./users.js');
// Test route (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to magic api!' });
});


// Routes that can be accessed by any one
// Add secret between client app and server to access this route ?
router.post('/user', users.create);
router.delete('/api/user', users.delete);

router.post('/login', auth.login);
router.post('/googleLogin', googleAuth.login);

//Routes that can be accessed only by autheticated users
router.get('/api/bears', bears.getAll);
router.get('/api/bears/:id', bears.getOne);
router.post('/api/bears/', bears.create);
router.put('/api/bears/:id', bears.update);
router.delete('/api/bears/:id', bears.delete);

//Routes that can be accessed only by authenticated & authorized users
router.get('/api/users/all', users.getAll);
router.get('/api/users', users.get); //?id=X,Y,Z
router.put('/api/user/:id', users.update);
router.delete('/api/admin/user/:id', users.delete);

module.exports = router;
