var jwt = require('jwt-simple');
var Users = require('../models/users');
var usersFunction = require('./users.js');
var request = require("request");
var Promise = require('promise');

var auth = {
    // must be promises
    validate: function(email, password) {
        return new Promise(function(resolve, reject) {
            if (email === '' || password === '') {
                reject("empty credentials");
            }
            Users.findOne({
                    'email': email,
                    'password': password,
                    //Prevent brute force google account
                    'type': 'default'
                })
                //Virtuals are NOT available for document queries or field selection.
                .select({
                    name: 1,
                    role: 1,
                    picture: 1
                })
                .exec(function(err, user) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    }
                    if (user !== null) {
                        resolve(user);
                    } else {
                        reject("This user doesn't exist");
                    }
                });
        });
    },

    //http://localhost:8080/login
    //Classique login using mail/password
    login: function(req, res) {
        var email = req.body.email || '';
        var password = req.body.password || '';
        auth.validate(email, password)
            .then(function(user) {
                // If authentication is success, we will generate a token
                // and dispatch it to the client
                res.json(auth.genToken(user));
            })
            .catch(function(errMessage) {
                res.status(401);
                res.json({
                    "status": 401,
                    "error": errMessage
                });
            });
    },

    genToken: function(user) {
        var expires = expiresIn(7); // 7 days
        var token = jwt.encode({
            exp: expires,
            userId: user._id,
            userRole: user.role
        }, require('../config/secret')());
        return {
            token: token,
            user: user
        };
    }

};

// private method
function expiresIn(numDays) {
    var dateObj = new Date();
    return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports = auth;