require('newrelic');

const url = require('url');
const _ = require('lodash');
const redis = require('redis').createClient(process.env.REDIS_URL || '//localhost:6379');
const express = require('express');
const app = express();

const PORT = process.env.PORT || 8080;

const WHITELISTED_TARGET_DOMAINS = [
  'requestbin.herokuapp.com'
];

const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer({
  ignorePath: true,
  changeOrigin: true
});

app.get('/', (req, res) => {
  res.send('Hello World');
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

app.post('/proxy', (req, res) => {
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

app.listen(PORT, () => console.log('Listening on', PORT));