var sinon = require('sinon'),
  assert = require('assert');

describe('The User Model', function () {
  describe('#Create()', function() {
    it('should save a user', function (done) {
      User.destroy({})
      .then(function() {
        User.create({
          username: 'username',
          email: 'user@domain.com',
          password: 'password'
        })
        .then(function(user) {
          done();
        })
        .catch(function(err) {
          done(err);
        });
      });
    });
  });
});

