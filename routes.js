'use strict';

var fs = require('fs'),
isEmail = require('./tools').isEmail,
errors = require('./errors'),
cursor, data;


try {
  initSchema(JSON.parse(fs.readFileSync('./data.json')));
}

catch (ex) {
  initSchema({});
  writeSync();
}


function initSchema (raw) {

  cursor = raw.cursor || 0;
  data = raw.data || new Array();

};

function writeSync () {

  fs.writeFileSync('./data.json', JSON.stringify({cursor: cursor, data: data}));

};

module.exports.add = function (req, auth, next) {

  var email = req.body.email;

  if (!email || email && !isEmail(email)) {
    return next(errors.Conflict('wrong email'));
  }

  if (this.data.indexOf(email) !== -1) {
    return next(errors.Conflict('already exists'));
  }

  this.data.push(email);
  this._writeSync();

  next({data: email});

};

module.exports.remove = function (req, auth, next) {

  var email = req.body.email, index;

  if (!email || email && !isEmail(email)) {
    return next(errors.Conflict('wrong email'));
  }

  index = this.data.indexOf(email);

  if (index == -1) {
    return next(errors.Conflict('does not exist'));
  }

  delete this.data[index];
  this._writeSync();

  next({data: email});

};

module.exports.import = function (req, auth, next) {

  if (!auth) {
    return next(errors.Unauthorized());
  }

  if (!req.body.data) {
    return next(errors.Conflict('data to import is empty'));
  }

  this.data.slice(this.cursor, this.data.length);
  this.data.concat(req.body.data.split("\n"));
  this.writeSync();

  next({data: this.data.join("\n")});

};

module.exports.export = function (req, auth, next) {

  if (!auth) {
    return next(errors.Unauthorized());
  }

  this.cursor = this.data.length;
  this._writeSync();

  next({data: this.data.join("\n")});

};

module.exports.empty = function (req, auth, next) {

  if (!auth) {
    return next(errors.Unauthorized());
  }

  this.cursor = 0;
  delete this.data;
  this.data = new Array();
  this._writeSync();

  next({data: ""});

};
