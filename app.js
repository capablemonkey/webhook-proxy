const url = require('url');
const express = require('express');
const app = express();

const PORT = process.env.PORT || 8080;
const DESTINATION_URL = process.env.DESTINATION_URL ||'https://requestbin.herokuapp.com/1g4lmbx1';

const CLIENT_ID = process.env.CLIENT_ID || '' ;
const CLIENT_SECRET = process.env.CLIENT_SECRET || '' ;
const USERNAME = process.env.USERNAME || '' ;
const PASSWORD = process.env.PASSWORD || '' ;
const TOKEN_ENDPOINT = process.env.TOKEN_ENDPOINT || '' ;
const REFRESH_INTERVAL_HOURS = 12;

var accessToken = process.env.ACCESS_TOKEN ||'SOMETOKEN';

const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer({
  target: url.parse(DESTINATION_URL),
  ignorePath: true,
  changeOrigin: true
});

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.post('/proxy', (req, res) => {
  proxy.web(req, res);
})

proxy.on('proxyReq', function(proxyReq, req, res, options) {
  proxyReq.setHeader('Authorization', `Bearer ${accessToken}`);
});

function generateAccessToken() {
  // TODO:
  accessToken = 'pretend';
}

setInterval(generateAccessToken, REFRESH_INTERVAL_HOURS * 60 * 60 * 1000);

app.listen(PORT, () => console.log('Listening on', PORT));