# limitless-garden ![Build status](https://travis-ci.org/abarbanell/limitless-garden.svg)

This is a small backend using 
Heroku / node.js / 3scale / MongoLab / Newrelic / d3.js

Continuous Integration is using [travis](https://travis-ci.org/abarbanell/limitless-garden)

It is deployed via heroku/github integration to 
http://limitless-garden-9668.herokuapp.com

we have a [HOWTO for setup with dokku on digitalocean](dokku.md)

How to run this locally for dev and test: 

we have Procfile and Procfile.test to run the app or the tests locally. You will need to set some 
environment vars to run with [heroku local](https://devcenter.heroku.com/articles/heroku-local): 

```
$ heroku local -e .env.test -f Procfile.test
```

with something like this in your .env.test file (this will be .gitignore'd)

```
TEST_MONGO_URL:          <yourkey>
MONGOLAB_URI:            <yourkey>
NEW_RELIC_LICENSE_KEY:   NONE
NEW_RELIC_LOG:           stdout
PAPERTRAIL_API_TOKEN:    <yourkey>
THREESCALE_PROVIDER_KEY: <yourkey>
ENVIRONMENT:             test
LOG_LEVEL:               info
GOOGLE_CLIENT_ID:        <yourkey>
GOOGLE_CLIENT_SECRET:    <yourkey>
GOOGLE_RETURN_URL_HOST:  <yourkey>
```

*Note: the threescale test will time out if you have no network, 
they need access to the threescale backend for authentication 
of the userkey* 

*Note: the local development environment via 
[devenv](https://github.com/abarbanell/devenv) can run without network 
but needs network to pull new images from docker for VM creation and start. 
So you need network to start the devenv VM, but then you can continue to work offline.*

*Note: sometimes the dokku application just hangs and responds with
error 502 or 503 from nginx. Have not yet found out why.*


## More information

- [dokku installation](dokku.md)
- [angular 5 setup](angular5.md)

