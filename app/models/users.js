var mongoose     = require('mongoose');
var counter = require('./counter');
var Schema       = mongoose.Schema;

var UsersSchema   = new Schema({
    _id: String,
    email: {
        type: String,
        unique: true,
        required: true,
        dropDups: true
    }, //login
    password : String,
    picture: {
        type: String,
        default: null
    },
    //Type of account ( default, google , fb)
    type: {
        type: String,
        default: 'default'
    },
    name: {
        first: String,
        last: String
    },
    role : String
},
{
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});

UsersSchema.virtual('name.full')
    .get(function() {
        return this.name.first + ' ' + this.name.last;
    })
    .set(function(name) {
        var split = name.split(' ');
        this.name.first = split[0];
        this.name.last = split[1];
    });

//Auto-increment
UsersSchema.pre('save', function(next) {
    var doc = this;
    counter.findByIdAndUpdate({
        _id: 'userid'
    }, {
        $inc: {
            seq: 1
        }
    }, function(error, counter) {
        if (error)
            return next(error);
        if (typeof doc._id === 'undefined') {
            doc._id = counter.seq;
        }
        next();
    });
});

//Exemple setting user
var User = mongoose.model('users', UsersSchema);
var userTest = new User();
userTest.email = "admin@api.fr";
userTest.password = "admin";
userTest.role = "admin";
userTest.name = {
    first: "super",
    last: "admin"
};
userTest.save(function(err) {
    if (err) console.log(err.err);
});

module.exports = User;

