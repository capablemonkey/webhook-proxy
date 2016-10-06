const url = require('url');
const redis = require('redis').createClient(process.env.REDIS_URL || '//localhost:6379');
const oauth2 = require('simple-oauth2').create({
  client: {
    id: process.env.CLIENT_ID,
    secret: process.env.CLIENT_SECRET
  },
  auth: {
    tokenPath: process.env.TOKEN_PATH,
    tokenHost: process.env.TOKEN_HOST
  }
});

const CREDENTIALS = {
  username: process.env.OWNER_USERNAME,
  password: process.env.OWNER_PASSWORD
};

function generateAccessToken(callback) {
  oauth2.ownerPassword.
    getToken(CREDENTIALS, (error, result) => {
      if (error) {
        throw new Error(`Error fetching access token ${error}`);
      }

      callback(error, result.access_token);
    });
}

function renewAccessToken() {
  generateAccessToken((error, access_token) => {
    redis.set('access_token', access_token, (error, result) => {
        if (error) {
          throw new Error('Error persisting token in redis: ', error.stack);
        }

        console.log('Successfully stored new token in redis');
        process.exit();
      });
  });
}

renewAccessToken();