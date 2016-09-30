const url = require('url');
const express = require('express');
const app = express();

const PORT = process.env.PORT || 8080;
const DESTINATION_URL = process.env.DESTINATION_URL ||'https://requestbin.herokuapp.com/1g4lmbx1';
const ACCESS_TOKEN = process.env.ACCESS_TOKEN ||'SOMETOKEN';

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
  proxyReq.setHeader('Authorization', `Bearer ${ACCESS_TOKEN}`);
});

app.listen(PORT, () => console.log('Listening on', PORT));