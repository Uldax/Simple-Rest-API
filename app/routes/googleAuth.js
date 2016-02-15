var jwt = require('jwt-simple');
var Users = require('../models/users');
var auth = require('./auth.js');
var request = require("request");
var Promise = require('promise');

var googleAuth = {
    //Validate the token receive from google api
    validateToken: function(token) {
        return new Promise(function(resolve, reject) {
            //To validate an ID token using the tokeninfo endpoint, make an HTTPS POST or GET request to the endpoint, and pass your ID token in the id_token (for google)
            var endpoint = "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" + token;
            request(endpoint, function(err, response, body) {
                if (!err && response.statusCode === 200) {
                    //Parse response into JSON
                    var info = JSON.parse(body);
                    if (info.sub) {
                        resolve(info);
                    } else {
                        reject("Wrong token");
                    }
                } else {
                    reject(err);
                }
            });
        });
    },

    //Return token for user and create it if needed
    login: function(req, res) {
        var token = req.body.token;
        if (typeof token === 'undefined') {
            res.json({
                "error": "undefined token"
            });
        }
        googleAuth.validateToken(token)
            .then(function(infoUser) {
                //Check if user already exist or first connexion
                checkFirstConnexion(info.email)
                    .then(function(user) {
                        var token = auth.genToken(user);
                        res.json(token);
                    })
            })
            .catch(function(errMessage) {
                res.status(401);
                res.json({
                    "status": 401,
                    "error": errMessage
                });
            });
    }
}

//Private function
function createGoogleUserObject(info) {
    var user = new User();
    user.email = info.email;
    var name = {
        first: info.name,
        last: info.family_name,
    };
    user._id = info.sub;
    user.name = name;
    user.type = 'google';
    //warning here but prevent by type
    user.password = require('../config/secret')();
    user.role = "user";
    return user;
}

function checkFirstConnexion(email) {
    return new Promise(function(resolve, reject) {
            Promise.resolve(User.findOne({
                        'email': email
                    })
                    .select({
                        name: 1,
                        role: 1,
                        _id: 1,
                        type: 1,
                        picture: 1
                    })
                    .exec())
                .then(function(user) {
                    if (user === null) {
                        var user = createGoogleUserObject(info);
                        saveGoogleUserObject(user)
                            .then(function() {
                                resolve(user);
                            })
                    }
                    resolve(user);
                })
        })
        .catch(function(errMessage) {
            reject(errMessage);
        });
}

function saveGoogleUserObject(UserObject) {
    return new Promise(function(resolve, reject) {
        userObject.save(function(err) {
            if (err) {
                reject(err);
            } else {
                resolve("User created!");
            }
        });
    });
}
module.exports = googleAuth;