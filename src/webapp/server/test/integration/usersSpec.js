'use strict';

// import models from '../../models/index';
// import user from '../../models/user';

var request = require('supertest'),
  express = require('express');

// var app = express();
var app      = require('../../app');

describe('user creation page', function () {
  beforeEach(function () {
    this.models = require('../../models');
  });

  it('lists a user if there is one', function (done) {
    this.models.User.create({ username: 'johndoe' }).then(function () {
      request(app).get('/').expect(/johndoe/, done);
    });
  });
});
