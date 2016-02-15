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
            Users.find({
                    'username': email,
                    'password': password
                })
                //Virtuals are NOT available for document queries or field selection.
                .select({
                    name: 1,
                    role: 1,
                    _id: 1,
                    type: 1,
                    picture: 1
                })
                .exec(function(err, user) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    }
                    //Prevent brute force google account
                    if (user.length === 1 && user[0].type === 'default') {
                        resolve(user[0]);
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
                res.json(genToken(user));
            })
            .catch(function(errMessage) {
                res.status(401);
                res.json({
                    "status": 401,
                    "error": errMessage
                });
            });
    },

    genToken : function(user) {
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

};

// private method
function expiresIn(numDays) {
    var dateObj = new Date();
    return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports = auth;