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


## Auth Requests - JSON WebSockets

### Get subscribers
From **:num** to **:num+10**, the newest to the oldest. If the parameter **:num** is empty, it will be set to **0** by default.

**Request**

    GET /subscribers/:num

To search a specific **:email**

    GET /subscribers/:email/:num

**Return**

    {
      "data": [
        {"email": "kim@gmail.com"},
        {"email": "sam@outlook.com"},
        {"email": "seif785@yahoo.com"},
        ...
      ]
    }

### Export the subscribers list

**Request**

    GET /subscribers/export

**Return**

    {
      "data": "kim@gmail.com\nsam@outlook.com\nseif785@yahoo.com\n..."
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
      "data": numberDeleted
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
