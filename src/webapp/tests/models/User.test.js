var sinon = require('sinon'),
  assert = require('assert');

describe('The User Model', function () {
  describe('#Create()', function() {
    it('should save a user', function (done) {
      User.create({
        username: 'username',
        email: 'user@domain.com',
        password: 'password'
      }).exec(function (err, user) {
        done(err, user);
      });
    });
  });
});

