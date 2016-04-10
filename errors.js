'use strict';

module.exports.Conflict = function (msg, err) {

  return {
    "statusCode": 409,
    "code": "ConflictError",
    "message": msg,
    "errors": err && typeof err.errors !== 'undefined' ? err.errors : err
  };

};

module.exports.NotFound = function (msg, err) {

  return {
    "statusCode": 404,
    "code": "NotFoundError",
    "message": msg,
    "errors": err && typeof err.errors !== 'undefined' ? err.errors : err
  };

};

module.exports.Unauthorized = function (msg, err) {

  return {
    "statusCode": 401,
    "code": "UnauthorizedError",
    "message": msg,
    "errors": err && typeof err.errors !== 'undefined' ? err.errors : err
  };

};
