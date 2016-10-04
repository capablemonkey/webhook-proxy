const url = require('url');
const _ = require('lodash');
const express = require('express');
const app = express();

const PORT = process.env.PORT || 8080;

const CLIENT_ID = process.env.CLIENT_ID || '' ;
const CLIENT_SECRET = process.env.CLIENT_SECRET || '' ;
const USERNAME = process.env.USERNAME || '' ;
const PASSWORD = process.env.PASSWORD || '' ;
const TOKEN_ENDPOINT = process.env.TOKEN_ENDPOINT || '' ;
const REFRESH_INTERVAL_HOURS = 12;

var accessToken = process.env.ACCESS_TOKEN ||'SOMETOKEN';

const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer({
  ignorePath: true,
  changeOrigin: true
});

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.post('/proxy', (req, res) => {
  const targetUrl = req.query['target'];

  if (!(_.isString(targetUrl) && targetUrl.length > 0)) {
    return res.
      status(400).
      send(JSON.stringify({ error: 'Missing target parameter' }));
  }

  console.log(`Forwarding from ${req.hostname}${req.originalUrl} to ${targetUrl}`);

  proxy.web(req, res, {
    target: url.parse(targetUrl)
  });
})

proxy.on('proxyReq', function(proxyReq, req, res, options) {
  proxyReq.setHeader('Authorization', `Bearer ${accessToken}`);
});

function generateAccessToken() {
  // TODO: build when we've got test credentials
  accessToken = 'pretend';
}

setInterval(generateAccessToken, REFRESH_INTERVAL_HOURS * 60 * 60 * 1000);

app.listen(PORT, () => console.log('Listening on', PORT));