[![Build Status](https://travis-ci.org/kaakaa/matter-meeting.svg?branch=master)](https://travis-ci.org/kaakaa/matter-meeting)
[![codecov](https://codecov.io/gh/kaakaa/matter-meeting/branch/master/graph/badge.svg)](https://codecov.io/gh/kaakaa/matter-meeting)

# matter-meeting

Mattermost integration for adjusting schedules and making appointments on Exchange server.

matter-meeting needs Mattermost v4.2 and higher.

## Run

```
cp config/default.json.sample config/default.json
vi config/default.json

docker-compose up -d
```

## Configure

https://github.com/kaakaa/matter-meeting/blob/master/config/default.json.sample

* server
  * host: Host of matter-meeting
  * port: Port number of matter-meeting
* ews
  * server: Host of exchange server
  * username: Username of account on exchange server
  * password: Password of account on exchange server
  * allowed_domain: The email address of the account subject to matter-meeting (to reduce server load)
    * You can use RegExp (e.g. `.+@example.com`)
* minio
  * endPoint: Host of Minio server
  * port: Port number of Minio server
  * secure: Secure settings for Minio
  * accessKey: Access key of Minio server
  * secretKey: Secret key of Minio server
  * bucket: Bucket name of Minio server

## License

Licensed under MIT.
