const assert = require('assert');
const request = require('supertest');
const proxy = require('../proxy.js');

describe('GET /', () => {
  it('respond with greeting', (done) => {
    request(proxy)
      .get('/')
      .expect('Hello World')
      .expect(200, done);
  });
});

describe('POST /proxy', () => {
  context('when the "target" query param is missing', () => {
    it('should respond with an error', (done) => {
      request(proxy)
        .post('/proxy')
        .expect('{"error":"Missing target parameter"}')
        .expect(400, done);
    });
  });

  context('when the "target" query param exists', () => {
    it('should reject non-HTTPS targets', (done) => {
      request(proxy)
        .post('/proxy')
        .query({ target: "http://www.google.com" })
        .expect('{"error":"Invalid target URL."}')
        .expect(400, done);
    });

    it('should reject non-whitelisted target domains', (done) => {
      WHITELISTED_TARGET_DOMAINS = []
      request(proxy)
        .post('/proxy')
        .query({ target: "https://www.bad-domain-324908094829048.com" })
        .expect('{"error":"Invalid target URL."}')
        .expect(400, done);
    });
  });
});