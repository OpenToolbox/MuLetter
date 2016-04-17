'use strict';

module.exports.ConflictError = 409;
module.exports.NotFoundError = 404;
module.exports.UnauthorizedError = 401;

module.exports.Conflict = function (msg, err) {

  return {
    "code": "ConflictError",
    "message": msg? msg : "",
    "errors": err && typeof err.errors !== 'undefined' ? err.errors : (err? err: {})
  };

};

module.exports.NotFound = function (msg, err) {

  return {
    "code": "NotFoundError",
    "message": msg? msg : "",
    "errors": err && typeof err.errors !== 'undefined' ? err.errors : (err? err: {})
  };

};

module.exports.Unauthorized = function (msg, err) {

  return {
    "code": "UnauthorizedError",
    "message": msg? msg : "",
    "errors": err && typeof err.errors !== 'undefined' ? err.errors : (err? err: {})
  };

};
