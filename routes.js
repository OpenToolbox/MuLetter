'use strict';

var isEmail = require('./tools').isEmail, errors = require('./errors');

module.exports.new = function(req, auth, next) {
  
  var email = req.body.email;

  if (!email || email && !isEmail(email)) {
    return next(errors.Conflict('wrong email'));
  }

  if (global.json.data.indexOf(email)) {
    return next(errors.Conflict('already exists'));
  }

  global.json.data.push(email);
  global.json.writeSync();
  
  next({data: email});

};

module.exports.remove = function(req, auth, next) {
  
  var email = req.body.email, index;

  if (!email || email && !isEmail(email)) {
    return next(errors.Conflict('wrong email'));
  }

  index = global.json.data.indexOf(email) || -1;

  if (index == -1) {
    return next(errors.Conflict('does not exist'));
  }

  delete global.json.data[index];
  global.json.writeSync();
  
  next({data: email});

};

module.exports.import = function(req, auth, next) {

  if (!auth) {
    return next(errors.Unauthorized());
  }
  
  if (!req.body.data) {
    return next(errors.Conflict('data to import is empty'));
  }

  global.json.data.slice(global.json.data.cursor, global.json.data.length);
  global.json.data.concat(req.body.data.split("\n"));
  global.json.writeSync();

  next({data: global.json.data.join("\n")});

};

module.exports.export = function(req, auth, next) {

  if (!auth) {
    return next(errors.Unauthorized());
  }

  global.json.data.cursor = global.json.data.length;
  global.json.writeSync();

  next({data: global.json.data.join("\n")});

};
