var express = require('express');
var router = express.Router();
var auth = require('./auth.js');
var googleAuth = require('./googleAuth.js');
var users = require('./users.js');
//require your routes

// Routes that can be accessed by any one
// Add secret between client app and server to access this route ?
router.post('/user', users.create);
router.delete('/api/user', users.delete);

router.post('/login', auth.login);
router.post('/googleLogin', googleAuth.login);

//Routes that can be accessed only by autheticated users
router.get('/api/users', users.get); //?id=X,Y,Z
router.put('/api/user', users.update);

//Routes that can be accessed only by authenticated & authorized users
router.get('/api/admin/users/all', users.getAll);

module.exports = router;
