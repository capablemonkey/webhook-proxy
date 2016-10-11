process.env['TARGET_DOMAIN_WHITELIST'] = 'google.com,greenhouse.io';

const assert = require('assert');
const request = require('supertest');
const proxy = require('../proxy.js');

describe('GET /ping', () => {
  it('respond with pong and timestamp', (done) => {
    request(proxy)
      .get('/ping')
      .expect(/^PONG (\d{4})-(\d{2})-(\d{2})T(\d{2})\:(\d{2})\:(\d{2})\.(\d{3})Z/)
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