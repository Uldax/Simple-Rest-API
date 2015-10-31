var jwt = require('jwt-simple');
var User = require('../models/user');

var auth = {
    // Fire a query to your DB and check if the credentials are valid
    validate: function(username, password) {
        // spoofing the DB response for simplicity
       if (username === '' || password === '') {
            return;
       }
       User.findOne( { 'username' : username, 'password':password}, function(err, user) {
            if (err) {
                return ;
            }
            return user;
        });
    },

    login: function(req, res) {
        var username = req.body.username || '';
        var password = req.body.password || '';
        var dbUserObj = auth.validate(username, password);
        // If authentication fails
        if  (!dbUserObj) {
                res.status(401);
                res.json({
                "status": 401,
                "message": "Invalid credentials"
            });
            return;
        }
        else {
            // If authentication is success, we will generate a token
            // and dispatch it to the client
            res.json(genToken(dbUserObj));
        }
    },
};

// private method
function expiresIn(numDays) {
    var dateObj = new Date();
    return dateObj.setDate(dateObj.getDate() + numDays);
}

function genToken(user) {
    var expires = expiresIn(7); // 7 days
    var token = jwt.encode({
        exp: expires
    }, require('../config/secret')());
    return {
        token: token,
        expires: expires,
        user: user
    };
}

module.exports = auth;