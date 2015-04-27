'use strict';

function ErrorAPI () {}

ErrorAPI.prototype.Conflict = function (msg, err) {

  return {
    "statusCode": 409,
    "code": "ConflictError",
    "message": msg,
    "errors": (err && typeof err.errors !== 'undefined')? err.errors:err
  };

};

ErrorAPI.prototype.NotFound = function (msg, err) {

  return {
    "statusCode": 404,
    "code": "NotFoundError",
    "message": msg,
    "errors": (err && typeof err.errors !== 'undefined')? err.errors:err
  };

};

ErrorAPI.prototype.Unauthorized = function (msg, err) {

  return {
    "statusCode": 401,
    "code": "UnauthorizedError",
    "message": msg,
    "errors": (err && typeof err.errors !== 'undefined')? err.errors:err
  };

};

module.exports = new ErrorAPI();
