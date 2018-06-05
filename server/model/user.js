const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _= require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: (value) => {
        return validator.isEmail(value);
      },
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      require: true
    },
    token: {
      type: String,
      require: true
    }
  }]
});

// this method returns a json when a mongoose schema is called
UserSchema.methods.toJSON = function () {
  var user = this;
  // responsible for taking the mongoose variable and converting it to an object
  var userObject = user.toObject();

  // only allows ID and EMAIL to be sent back to JSON
  return _.pick(userObject, ['_id', 'email']);
};

// an instance methods ex: a getter in an object variable
UserSchema.methods.generateAuthToken = function() {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

  user.tokens = user.tokens.concat([{access,token}]);

  return user.save().then(()=> {
    return token;
  });
};

// model method or otherwise known as a static method
UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;

  try {
    // need the token and the secret (salt)
    decoded = jwt.verify(token, 'abc123');
  } catch (e) {
    // rejects the promise if jwt.verify() is not correct
    return Promise.reject();
  }

  // when theres a '.' in a value you have to put it in quotes, have to do this to get a nested document
  // findOne returns a promise
  return User.findOne({
    // wrapped _id in '' to keep it consistent
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

// mongoose middleware
UserSchema.pre('save', function(next) {
  var user = this;

  // this middleware runs everytime we modify anything in our object,
  // so if we change our email, then our password might get rehashed and we dont want that
  if(user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password,salt,(err,hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

var User = mongoose.model('User', UserSchema);

module.exports ={User};
