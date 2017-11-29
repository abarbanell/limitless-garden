## HOWTO for dokku on digitalocean

### Maintenance

How to cleanup old containers - before an OS upgrade

1. dokku cleanup

```
dokku cleanup
```

2. remove exited containers

```
sudo -s
docker ps -aq -f status=exited | xargs docker rm
```

3. OS upgrade

```
sudo apt-get update
sudo apt-get upgrade
```



### Setup

- create digitalocean account if you don't have one
- create digital ocean server  with dokku image (1GB RAM for 10$/month should do) 
- point your DNS to the new server with two A records (one for your
dokku server and one wildcard record for *.<your dokku server>. If
you use BIND as your DNS server the zone file would look similar
to this:

```
$ORIGIN example.tld
$TTL 5m

myserver         IN      A       127.0.0.1
*.myserver       IN      A       127.0.0.1
```

- go with a browser to your dokku server and you should see the
setup screen. Upload your ssh key and fill out the other fields and
save.
- change the hostname on the dokku setup screen and enable virtual host naming
- set up your own sudo user so that you do not need to use the root account
- optional: put additional public ssh keys into your $HOME/.ssh/authorized_keys file if you are connecting from multiple desktop PC's
- optional: install [new relic server](http://www.newrelic.com)
- create a mongo backing store with 

```
$ dokku mongo:create <instance_name> 
```

- create an app and link mongo service

```
$ dokku app:create lg
$ dokku mongo:link mongo lg
```

- you will need to set the DNS with a plain and a wildcard A record
(see
[here](https://www.digitalocean.com/community/tutorials/how-to-use-the-digitalocean-dokku-application). On my DNS provider 
there is now support for wildcard A records, so I have set up one record for each application subdomain, 
all with the same host address.
- we need to set some environment variables in the app like so: 

```
$ dokku config:set lg GOOGE_CLIENT_ID=<your-google-clientid>
$ dokku config:set lg GOOGLE_CLIENT_SECRET=<your-google-client-secret>
$ dokku config:set lg GOOGLE_RETURN_URL_HOST=<your google return host url>
$ dokku config:set lg LOGLEVEL=error
$ dokku config:set lg PAPERTRAIL_API_TOKEN=<your-papertrail-api-token>
$ dokku config:set lg NEW_RELIC_LICENSE_KEY=<your-new-relic-license-key>
$ dokku config:set lg NEW_RELIC_LOG=stdout
$ dokku config:set lg THREESCALE_PROVIDER_KEY=<your-3scale-apikey>
$ dokku config:set lg NPM_CONFIG_PRODUCTION=false
$ dokku config:set lg NODE_ENV=production
```

- for google auth we need SSL. We get a certificate with [letsencrypt](https://www.letsencrypt.org) via the dokku plugin 
[sseemayer/dokku-letsencrypt](https://github.com/sseemayer/dokku-letsencrypt)
described in more detail in this [blog post of the
author](https://blog.semicolonsoftware.de/securing-dokku-with-lets-encrypt-tls-certificates/)


```
$ sudo dokku plugin:install https://github.com/sseemayer/dokku-letsencrypt.git
$ dokku letsencrypt myapp
```

- now you have an app which can be deployed to. So you go on your development system and connect git to a remote:

```
$ git remote add dokku dokku@dokku.me:lg
$ git push dokku master
```




