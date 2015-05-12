## Public Requests - JSON REST
### Add a subscriber

**Request**

    POST  /subscribers

**Parameters**

    {
      "email": "user@domail.com"
    }

**Errors**

**409** Already exists

### Sign Up / Log In Step 1 - Email

**Request**

    GET /signin/:email

**Errors**

**409** Already signed in

### Sign Up / Log In Step 2 - Password

**Request**

    POST  /signin

**Parameters**

    {
      "email": me@domain.com,
      "pwd": password
    }


**Return**

    {
      "data": {
        "session": {
          "id": hash
          "expires": timeExpirationDate
        }
      }
    }


**Errors**

**409** wrong email or password


### Get posts
From **:num** to **:num+10**, the newest to the oldest. If the parameter **:num** is empty, it will be set to **0** by default.

**Request**

    GET /posts/:num

**Return**

    {
      "data": {
        "posts" : [
          {
            "subject": "My Subject",
            "postDate": timePostDate,
            "body": "lorem ipsum ...."
          },
          ...
        ]
      }
    }



## Auth Requests - JSON WebSockets

### Authentication on 443 port

**Parameters**

    {
      "session": {
        "id": hash
        "expires": timeExpirationDate
      }
    }

### JSON subject type for requests

    {
      "method": "GET",
      "url": "/subcribers",
      "body": parameters  
    }


### Get subscribers
From **:num** to **:num+10**, the newest to the oldest. If the parameter **:num** is empty, it will be set to **0** by default.

**Request**

    GET /subscribers/:num

To search a specific **:email** encoded with encodeURIComponent

    GET /subscribers/:email/:num

If using WebSocket, **:email* can be passed as a JSON parameter.

**Parameters**

    {
        "email": email;
    }

**Return**

    {
      "data": {
        "subscribers": [
            {"email": "kim@gmail.com"},
            {"email": "sam@outlook.com"},
            {"email": "seif785@yahoo.com"},
            ...
          ]
        }
    }

### Export the subscribers list

**Request**

    GET /subscribers/export

**Return**

    {
      "data": {
        "subscribers": "kim@gmail.com\nsam@outlook.com\nseif785@yahoo.com\n..."
        }
    }

### Insert new subscribers

**Request**

      POST /subscribers

**Parameters**

    {
      "subscribers":  "kim@gmail.com\nsam@outlook.com\nseif785@yahoo.com\n..."
    }


### Delete all subscribers

**Request**

    DELETE /subscribers/all

**Return**

    {
      "data": {
        "subscribers": numberDeleted
      }
    }


### Delete a subscriber

**Request**

    DELETE /subscribers

**Parameters**

    {
      "email": "user@domail.com"
    }

**Errors**

**409** does not exist


### Add a post-draft

**Request**

    POST /posts


**Parameters**

    {
      "subject": "mailSubject",
      "body": "htmlBody"
    }


**Return**

    {
      "data": {
        "posts" : {
          "_id": "postId",
          "subject": "mailSubject",
          "postDate": "0", // means it is a draft
          "draftDate": "timeDraftDate",
          "body": "htmlBody"
        }
      }
    }


### Send a post-draft / Create a post

**Request**

    PATCH /posts


**Parameters**

    {
      "_id": "postId"
    }


**Return**

Sending

    {
      "data": {
        "posts" : {
          "_id": "postId",
          "subject": "mailSubject",
          "postDate": 0, // means the post is being sent
          "draftDate": "timeDraftDate",
          "body": "htmlBody"
        }
      }
    }


Sent to any subscribers

    {
      "data": {
        "posts" : {
          "_id": "postId",
          "subject": "mailSubject",
          "postDate": "timePostDate", // means the draft has been sent
          "draftDate": "timeDraftDate",
          "body": "htmlBody"
        }
      }
    }


**Errors**

**409** a post is being sent

**409** does not exist or already sent

**409** can't load subscribers list

**409** can't load settings

**409** can't lock post to send


**Notifications**

    {
      "data": {
        "notifications": {
          "error": {"nodemailer"....}, // means this is a notification error
          "posts": {
            "_id": "id",
            "subject": "subject"
          },
          "date": "timeDate",
          "to": "emailTo"
        }
      }
    }


### Get posts and drafts
From **:num** to **:num+10**, the newest to the oldest. If the parameter **:num** is empty, it will be set to **0** by default. It will also return the drafts at first.

**Request**

    GET /posts/:num

To search a specific string **:string** encoded with encodeURIComponent.

    GET /posts/:string/:num

If using WebSocket, **:string** can be passed as a JSON parameter.

**Parameters**

    {
        "string": string;
    }

**Return**

    {
      "data": {
        "posts":
          [
          {
              "_id":"postId",
              "subject": "mailSubject",
              "postDate": "0", // means it is a draft
              "draftDate": "timeDraftDate",
              "body": "htmlBody"
            },
            {
              "_id":"postId",
              "subject": "mailSubject",
              "postDate": "timePostDate", // means it is a post
              "draftDate": "timeDraftDate",
              "body": "htmlBody"
              },
            ...
          ]
        }
    }

### Delete all posts and drafts

**Request**

    DELETE /posts/all

**Return**

    {
      "data": {
        "posts" : numberDeleted
      }
    }


### Delete a post or a draft

**Request**

    DELETE /posts

**Parameters**

    {
      "_id":"id",
    }

**Errors**

**409** does not exist


### Get settings

**Request**

    GET /settings


**Return**

    {
      "data": {
        "settings": {
          "from": {
            "fullname": "Mu Letter",
            "email": "me@domain.com"
          }
        }
      }
    }


### Edit settings

**Request**

    POST /settings


**Parameters**

    {
      "from": {
        "fullname": "Mu Letter",
        "email": "me@domain.com"
      }
    }


## Errors
**Return**

    {
      "statusCode": statusCode, // Only for JSON WebSockets
      "data": {
        "code": CodeError,
        "message": message
      }
    }

**StatusCode / Code**

**401** UnauthorizedError

**404** NotFoundError

**409** ConflictError
