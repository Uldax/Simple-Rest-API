var jwt = require('jwt-simple');
var validateUser = require('../routes/auth').validateUser;

module.exports = function(req, res, next) {
    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    console.log("token =  " + token);
    if (token) {
        try {
            var decoded = jwt.decode(token, require('../config/secret.js')());
            console.log(decoded);
            if (decoded.exp <= Date.now()) {
                res.status(400);
                res.json({
                    "status": 400,
                    "message": "Token Expired"
                });
                return;
            }

            //if no admin acces needed, allow public acess
            if (req.url.indexOf('admin') < 0 && req.url.indexOf('/api/') >= 0) {
                next(); // To move to next middleware
            } else {
                // Authorize the user to see if s/he can access our resources
                //  The key would be the logged in user's username
                validateUser(decoded.user.name)
                    .then(function(user) {
                        console.log(user);
                        console.log(user.role);
                        if (req.url.indexOf('admin') >= 0 && user.role == 'admin') {
                            next(); // To move to next middleware
                        } else {
                            res.status(403);
                            res.json({
                                "status": 403,
                                "message": "Not Authorized"
                            });
                            return;
                        }
                    })
                    .catch(function(errMessage) {
                        // No user with this name exists, respond back with a 401
                        res.status(401);
                        res.json({
                            "status": 401,
                            "message": "Invalid User"
                        });
                        return;
                    });
            }
        } catch (err) {
            res.status(500);
            res.json({
                "status": 500,
                "message": "Oops something went wrong",
                "error": err
            });
        }
    } else {
        res.status(401);
        res.json({
            "status": 401,
            "message": "Invalid Token or Key"
        });
        return;
    }
};