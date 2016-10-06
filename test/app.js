const assert = require('assert');
const request = require('supertest');
const proxy = require('../proxy.js');

describe('GET /', function() {
  it('respond with greeting', function(done) {
    request(proxy)
      .get('/')
      .expect('Hello World')
      .expect(200, done);
  });
});