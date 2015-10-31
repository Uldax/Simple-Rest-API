var Bear = require('../models/bear');

var bear = {
    getAll: function(req, res) {
        console.log("get Bears");
        Bear.find(function(err, bears) {
            if (err) {
                res.send(err);
            }
            res.json(bears);
        });
    },

    getOne: function(req, res) {
        Bear.findById(req.params.bear_id, function(err, bear) {
            if (err) {
                res.send(err);
            }
            res.json(bear);
        });
    },

    create: function(req, res) {
        var bear = new Bear();
        bear.name = req.body.name;
        bear.save(function(err){
            if (err) {
                res.send(err);
            }
            else {
                console.log('bear saved!');
                res.json({ message: 'Bear created!' });
            }
        });
    },

    update: function(req, res) {
        // use our bear model to find the bear we want
        Bear.findById(req.params.bear_id, function(err, bear) {
            if (err) {
                res.send(err);
            }
            bear.name = req.body.name;  // update the bears info
            // save the bear
            bear.save(function(err) {
                if (err){
                    res.send(err);
                }
                res.json({ message: 'Bear updated!' });
            });
        });
    },

    delete: function(req, res) {
        Bear.remove({_id: req.params.bear_id}, function(err, bear) {
                if (err) {
                    res.send(err);
                }
                res.json({ message: 'Successfully deleted' });
        });
    }
};

module.exports =bear;