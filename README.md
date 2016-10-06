# webhook proxy

Forwards requests to a target url and appends an Authorization header with an OAuth access token to the request.  For example, to forward a request to `https://requestbin.herokuapp.com/s8ul1as8`, pass the URL via the `target` querystring param:

```
POST /proxy?target=https%3A%2F%2Frequestbin.herokuapp.com%2Fs8ul1as8
```

As a result the proxy will make a request to `https://requestbin.herokuapp.com/s8ul1as8` with the following header:

```
Authorization: Bearer <access_token>
```

The `access_token` is stored in Redis and set via the `generateToken.js` script, which should be run periodically if the access token expires.  This script only supports OAuth `password` grant, which exchanges a resource owner's username and password for an access token.

Server errors from the proxy will result in a JSON response:

```
{"error": "Missing target parameter"}
```

## Getting started

Install dependencies:

```
npm install
```

The following environment variables must be set:

```
CLIENT_ID="example_id"
CLIENT_SECRET="example_secret"
OWNER_USERNAME="joe"
OWNER_PASSWORD="letmein"
TOKEN_HOST="https://www.somehost.com"
TOKEN_PATH="/oauth/token"
REDIS_URL="redis://user:pw@someinstance.com:8888"
TARGET_DOMAIN_WHITELIST="domainA.com,domainB.com,..." # comma separated
```

Run the proxy server:

```
node app.js
```

Run the access token generator:

```
node generateToken.js
```

## Tests

Run tests:

```
npm test
```