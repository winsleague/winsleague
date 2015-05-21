'use strict';

var request = require('supertest'),
  express = require('express');

var app = express();

describe('Index route', function() {
  describe('GET /', function() {
    it('returns status code 200', function(done) {
      request(app)
        .get('/')
        .expect(200, done);
    });
  });
});
