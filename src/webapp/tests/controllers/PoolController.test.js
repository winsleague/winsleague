var sinon = require('sinon'),
  assert = require('assert'),
  request = require('supertest');

describe('The Pool Controller', function () {
  describe('GET /index', function() {
    it('should require login', function (done) {
      request(sails.hooks.http.app)
        .get('/pool')
        .expect(302)
        .expect('location', '/login', done);
    });
  });
});

