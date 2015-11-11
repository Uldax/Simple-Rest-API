var jwt = require('jwt-simple');
var User = require('../models/user');
var Promise = require('promise');

var auth = {
    // Fire a query to your DB and check if the credentials are valid
    // must be promises
    validate: function(username, password) {
        console.log("validate username= " + username + " and password = " + password);
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
                //todo check user length
                resolve(user);
            });
        });
    },
    //Call after token check to get user role and information
    //Todo use db call
    validateUser: function(username) {
        // spoofing the DB response for simplicity
        var dbUserObj = { // spoofing a userobject from the DB.
            name: 'admin',
            role: 'admin',
            username: 'admin'
        };
        return dbUserObj;
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
            .catch(function(err) {
                res.status(401);
                res.json({
                    "status": 401,
                    "message": "Invalid credentials"
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
        exp: expires
    }, require('../config/secret')());
    return {
        token: token,
        expires: expires,
        user: user
    };
}

module.exports = auth;