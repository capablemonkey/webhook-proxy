const express = require('express');
const app = express();

const PORT = process.env.PORT || 8080;
const DESTINATION_URL = 'https://requestbin.herokuapp.com/1g4lmbx1';
const ACCESS_TOKEN = 'SOMETOKEN';

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(PORT, () => console.log('Listening on', PORT));