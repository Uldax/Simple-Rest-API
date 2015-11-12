var jwt = require('jwt-simple');
var User = require('../models/user');
var Promise = require('promise');

var auth = {
    // Fire a query to your DB and check if the credentials are valid
    // must be promises
    validate: function(username, password) {
        return new Promise(function(resolve, reject) {
            if (username === '' || password === '') {
                reject("empty credentials");
            }
            User.find({
                'username': username,
                'password': password
            }, function(err, user) {
                if (err) {
                    reject(err);
                }
                if (user.length === 1) {
                    resolve(user[0]);
                } else {
                    reject("database error");
                }

            });
        });
    },
    //Call after token token check to get user role and information
    validateUser: function(username) {
        return new Promise(function(resolve, reject) {
            User.find({
                'username': username
            }, function(err, user) {
                if (err) {
                    reject(err);
                }
                if (user.length === 1) {
                    resolve(user[0]);
                } else {
                    reject("multiple user");
                }
            });
        });
    },

    //http://localhost:8080/login
    login: function(req, res) {
        var username = req.body.username || '';
        var password = req.body.password || '';
        auth.validate(username, password)
            .then(function(user) {
                // If authentication is success, we will generate a token
                // and dispatch it to the client
                res.json(genToken(user));
            })
            .catch(function(errMessage) {
                res.status(401);
                res.json({
                    "status": 401,
                    "message": errMessage
                });
            });
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
        exp: expires,
        user : user
    }, require('../config/secret')());
    return {
        token: token,
        expires: expires,
        user: user
    };
}

module.exports = auth;