const url = require('url');
const _ = require('lodash');
const redis = require('redis').createClient(process.env.REDIS_URL || '//localhost:6379');
const express = require('express');
const server = express();

const WHITELISTED_TARGET_DOMAINS = process.env.TARGET_DOMAIN_WHITELIST.split(',');

const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer({
  ignorePath: true,
  changeOrigin: true
});

server.get('/ping', (req, res) => {
  res.send(`PONG ${(new Date).toISOString()}`);
});

function validTargetUrl(targetUrl) {
  const target = url.parse(targetUrl);

  if (target.protocol !== 'https:') {
    return false;
  } else if (!_.includes(WHITELISTED_TARGET_DOMAINS, target.host)) {
    return false;
  }

  return true;
};

server.post('/proxy', (req, res) => {
  const targetUrl = req.query['target'];

  if (!(_.isString(targetUrl) && targetUrl.length > 0)) {
    return res.
      status(400).
      send(JSON.stringify({ error: 'Missing target parameter' }));
  }

  if (!validTargetUrl(targetUrl)) {
    return res.
      status(400).
      send(JSON.stringify({ error: 'Invalid target URL.'}));
  }

  console.log(`Forwarding from ${req.hostname}${req.originalUrl} to ${targetUrl}`);

  redis.get('access_token', (err, accessToken) => {
    if (err) {
      return res.
        status(500).
        send(JSON.stringify({ error: 'Unable to retrieve access token'}));
    }

    proxy.web(req, res, {
      target: url.parse(targetUrl),
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  });
});

module.exports = server;