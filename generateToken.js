const redis = require('redis').createClient(process.env.REDIS_URL || '//localhost:6379');

const CLIENT_ID = process.env.CLIENT_ID || '' ;
const CLIENT_SECRET = process.env.CLIENT_SECRET || '' ;
const USERNAME = process.env.USERNAME || '' ;
const PASSWORD = process.env.PASSWORD || '' ;
const TOKEN_ENDPOINT = process.env.TOKEN_ENDPOINT || '' ;

function generateAccessToken(callback) {
  // fake generator for now
  return callback(null, (new Date).toISOString());
}

function renewAccessToken() {
  generateAccessToken((error, access_token) => {
    redis.set('access_token', access_token, (error, result) => {
        if (error) {
          console.error('Error persisting token in redis: ', error.stack);
        } else {
          console.log('Successfully stored new token in redis');
        }

        process.exit();
      });
  });
}

renewAccessToken();