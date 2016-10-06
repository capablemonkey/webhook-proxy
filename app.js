require('newrelic');

const PORT = process.env.PORT || 8080;
const proxy = require('./proxy.js');

proxy.listen(PORT, () => console.log('Listening on', PORT));