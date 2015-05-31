'use strict';

var request = require('supertest');

import app from '../../app';

describe('user creation page', function () {
  beforeEach(function () {
    this.models = require('../../models');
    this.models.User.destroy({ truncate: true });
  });

  it('lists a user if there is one', function (done) {
    this.models.User.create({ username: 'johndoe' }).then(function () {
      request(app)
        .get('/users')
        .expect(/"username":"johndoe"/)
        .end(function(err, res) {
          if (err) {
            done.fail(err);
          } else {
            done();
          }
        });
    });
  });
});
