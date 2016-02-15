var User = require('../models/users');

function formatJsonError(err){
    console.log(err);
    var jsonError = { error: err.err  };
    return jsonError;
}

function createUserObject(reqBody){
        var user = new User();
        user.email = reqBody.email;
        var name = {
            first: reqBody.first,
            last: reqBody.last,
        };
        user.name = name;
        user.password = reqBody.password;
        user.role = reqBody.role;
        return user
}

var user = {
    getAll: function(req, res) {
        User.find(function(err, users) {
            if (err) {
                res.json(formatJsonError(err));
            }
            res.json(users);
        });
    },

    //Get one or multiple user
    //TODO : fix it !
    get: function(req, res) {
        //req.query.id => get &id =
        //check if multiple user asked
        if (!(req.query.id.indexOf(',') === -1)) {
            console.log(req.query.id);
            var ids = req.query.id.split(',');
            console.log(ids);
            User.find({
                '_id': {
                    $in: ids
                }
            }, function(err, users) {
                if (err) {
                    res.json({
                        error: err.err
                    });
                }
                res.json(users);
            });
        } else {
            User.findById(req.query.id, function(err, user) {
                if (err) {
                    res.json(formatJsonError(err));
                }
                res.json(user);
            });
        }
    },

    create: function(req, res) {
        var userObject = createUserObject(req.body);
        userObject.save(function(err) {
            if (err) {
                res.json(formatJsonError(err));
            } else {
                res.json({
                    message: 'User created!'
                });
            }
        });
    },

    update: function(req, res) {
        var id = req.params.id;
        User.findById(req.params.id, function(err, user) {
            if (err) {
                res.json(formatJsonError(err));
            }
            //TODO
            user.name = req.body.name;
            user.save(function(err) {
                if (err) {
                    res.send(err);
                }
                res.json({
                    message: 'User updated!'
                });
            });
        });
    },

    delete: function(req, res) {
        User.remove({
            _id: req.params.id
        }, function(err, bear) {
            if (err) {
                res.json(formatJsonError(err));
            }
            res.json({
                message: 'Successfully deleted'
            });
        });
    },

    createUserObject: function(reqBody){
            var user = new User();
            user.email = reqBody.email;
            var name = {
                first: reqBody.first,
                last: reqBody.last,
            };
            user.name = name;
            user.password = reqBody.password;
            user.role = reqBody.role;
            return user
    }
};

module.exports = user;