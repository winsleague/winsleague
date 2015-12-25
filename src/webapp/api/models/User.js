"use strict";

var bcrypt = require('bcrypt');

module.exports = {
  attributes: {
    email: {
      type: 'string',
      required: true,
      unique: true
    },

    password: {
      type: 'string',
      minLength: 6,
      required: true
    },

    firstName: {
      type: 'string'
    },

    lastName: {
      type: 'string'
    },

    toJSON: function() {
      let obj = this.toObject();
      delete obj.password;
      return obj;
    }
  },
  beforeCreate: function(user, cb) {
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) {
          console.log(err);
          cb(err);
        } else {
          user.password = hash;
          cb();
        }
      });
    });
  }
};
