# webhook proxy

## Getting started

Install dependencies:

```
npm install
```

Run the proxy server:

```
node app.js
```

Run the access token generator (this should be run periodically if the access token expires):

```
node generateToken.js
```

The token generator requires the following environment variables to be set:

```
CLIENT_ID="example_id"
CLIENT_SECRET="example_secret"
OWNER_USERNAME="joe"
OWNER_PASSWORD="letmein"
TOKEN_HOST="https://www.somehost.com"
TOKEN_PATH="/oauth/token"
```

## Tests

Run tests:

```
npm test
```