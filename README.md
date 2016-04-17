# µLetter

**µLetter** or **MuLetter** is a small node http server to send mass emails (lower than 1000 emails)


## Clone, Config, Deploy

1) Clone or download this repo

2) Configure your **host**, **port** and **key** in config.json

3) Deploy all files on OpenShift, Heroku, AWS, your own server...


## API

### Send a newsletter

**Request**

    POST  /send

**Parameters**

    {
      "key": "yourKey",
      "to": "kim@gmail.com\nkim@outlook.com\nkim@yahoo.com\n...",
      "subject": "the title",
      "body": "Lorem ipsum dolor sit amet ..."
    }

**Return**

    {
      "sending": "1"
    }


**Errors**

**401** Unauthorized

**409** body is required

**409** at least one email is required


### Check status

The last logs are removed every time a mass email is sent

**Request**

    POST  /status

**Parameters**

    {
      "key": "yourKey"
    }

**Return**

    {
      "sending: "0 || 1",
      "logs": {
        "success": "user@domail.com\n...",
        "error": "kimdomail.com\nkim@.com..."
      }
    }


**Errors**

**401** Unauthorized
