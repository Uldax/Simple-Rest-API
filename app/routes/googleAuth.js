var User = require('../models/users');
var auth = require('./auth.js');
var request = require("request");
var Promise = require('promise');

var googleAuth = {
    /*To validate an ID token using the tokeninfo endpoint, make an HTTPS
    POST or GET request and pass your id_token (for google) */
    validateToken: function(token) {
        return new Promise(function(resolve, reject) {
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
                    if (response.statusCode === 400) {
                        reject('Bad Request');
                    }
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
            .then(checkFirstConnexion)
            .then(function(user) {
                var token = auth.genToken(user);
                res.json(token);
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

function checkFirstConnexion(info) {
    return new Promise(function(resolve, reject) {
        var userObject = createGoogleUserObject(info).toObject();
        User.findOneAndUpdate({
                    _id: userObject._id
                },
                userObject, {
                    upsert: true, //insert if don't exist
                    new: true //return the new document if created
                })
            .exec(function(err, user) {
                if (err) {
                    reject(err);
                }
                if (user !== null) {
                    resolve(user);
                } else {
                    reject("This user doesn't exist");
                }
            });
    });
}
module.exports = googleAuth;