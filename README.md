# limitless-garden ![Build status](https://travis-ci.org/abarbanell/limitless-garden.svg)

This is a small backend using 
Heroku / node.js / 3scale / MongoLab / Newrelic

Continuous Integration is using travis-ci.org


It is deployed via heroku/github integration to 
http://limitless-garden-9668.herokuapp.com

## HOWTO for dokku on digitalocean

- create digitalocean account if you don't have one
- create digital ocean server (1GB RAM for 10$/month should do) 
- set up your own sudo user so that you do not need to use the root account
- put public ssh keys into your $HOME/.ssh/authorized_keys file
- create a mongo backing store with 

```
$ dokku mongo:create <instance_name> 
```

