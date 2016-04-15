'use strict';

var isEmail = require('./tools').isEmail,
errors = require('./errors'),
jsonOpen = require('./tools').jsonOpen,
db = new jsonOpen('./data.json');

module.exports.add = function(req, auth, next) {

  var email = req.body.email;

  if (!email || email && !isEmail(email)) {
    return next(errors.Conflict('wrong email'));
  }

  if (db.raw.data.indexOf(email) !== -1) {
    return next(errors.Conflict('already exists'));
  }

  db.raw.data.push(email);
  db.writeSync();

  next({data: email});

};

module.exports.remove = function(req, auth, next) {

  var email = req.body.email, index;

  if (!email || email && !isEmail(email)) {
    return next(errors.Conflict('wrong email'));
  }

  index = db.raw.data.indexOf(email);

  if (index == -1) {
    return next(errors.Conflict('does not exist'));
  }

  delete db.raw.data[index];
  db.writeSync();

  next({data: email});

};

module.exports.import = function(req, auth, next) {

  if (!auth) {
    return next(errors.Unauthorized());
  }

  if (!req.body.data) {
    return next(errors.Conflict('data to import is empty'));
  }

  db.raw.data.slice(db.raw.cursor, db.raw.data.length);
  db.raw.data.concat(req.body.data.split("\n"));
  db.writeSync();

  next({data: db.raw.data.join("\n")});

};

module.exports.export = function(req, auth, next) {

  if (!auth) {
    return next(errors.Unauthorized());
  }

  db.raw.cursor = db.raw.data.length;
  db.writeSync();

  next({data: db.raw.data.join("\n")});

};

module.exports.empty = function(req, auth, next) {

  if (!auth) {
    return next(errors.Unauthorized());
  }

  db.raw.cursor = 0;
  delete db.raw.data;
  db.raw.data = new Array();
  db.writeSync();

  next({data: ""});

};
