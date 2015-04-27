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
            "object": "My Object",
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

### JSON object type for requests

    {
      "method": "GET",
      "url": "/subcribers",
      "body": parameters  
    }


### Get subscribers
From **:num** to **:num+10**, the newest to the oldest. If the parameter **:num** is empty, it will be set to **0** by default.

**Request**

    GET /subscribers/:num

To search a specific **:email**

    GET /subscribers/:email/:num

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


### Add a draft

**Request**

    PUT /posts

**Parameters**

    {
      "object": "My Object",
      "body": "lorem ipsum..."
    }

**Return**

    {
      "data": {
        "posts": {
          "_id": "id",
          "postDate": "0",
          "draftDate": "time",
          "object": "My Object",
          "body": "lorem ipsum..."
        }
      }
    }


### Create a post / Send a draft

**Request**

    POST /posts

**Parameters**

    {
      "_id": "id"
    }

**Return**

    {
      "data": {
        "posts": {
          "_id": "id",
          "postDate": "time",
          "draftDate": "time",
          "object": "My Object",
          "body": "lorem ipsum..."
        }
      }
    }

### Get posts and drafts
From **:num** to **:num+10**, the newest to the oldest. If the parameter **:num** is empty, it will be set to **0** by default. It will also return the drafts at first.

**Request**

    GET /posts/:num

To search a specific string **:string**

    GET /posts/:string/:num

**Return**

    {
      "data": {
        "posts":
          [
          {
              "_id":"id",
              "object": "My Object",
              "postDate": "0", // means it is a draft
              "draftDate": "timeDraftDate",
              "body": "lorem ipsum ...."
            },
            {
              "_id":"id",
                "object": "My Object",
                "postDate": "timePostDate", // means it is a post
                "draftDate": "timeDraftDate",
                "body": "lorem ipsum ...."
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
          "expName": "Mu Letter",
          "expEmail": "me@domain.com"
        }
      }
    }


### Edit settings

**Request**

    PATCH /settings


**Parameters**

    {
      "expName": "Mu Letter",
      "expEmail": "me@domain.com"
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
