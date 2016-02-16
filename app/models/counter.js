//Schema for autoIncrement id
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CounterSchema = Schema({
    _id: {
        type: String,
        unique: true,
        required: true,
        dropDups: true
    },
    seq: {
        type: Number,
        default: 0
    }
});
var Counter = mongoose.model('counter', CounterSchema);

//Exemple autoIncrement settings
var userIncrement = new Counter();
userIncrement._id = "userid";
userIncrement.seq = 0;
userIncrement.save(function(err) {
    //entry already exist
    if (err.code != 11000) {
        console.log(err);
    }
});


module.exports = Counter;