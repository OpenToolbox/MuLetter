'use strict';

var os = require('os');
var errors = require('../errors');
var nedb = require('nedb');
var db = new nedb(global.db_settings);

function Settings () {
  db.loadDatabase()
}

Settings.prototype.get = function(req, auth, next) {
  if (!auth)
    return next(errors.Unauthorized());

  db.findOne({name:'from'}, {}, function(err, from) {
    var output = {};
    output.fullname = (!err && from && from.fullname)? from.fullname:global.name;
    output.email = (!err && from && from.email)? from.email:'noreply@'+os.hostname();
    next(output);
  });
};

Settings.prototype.post = function(req, auth, next) {
  if (!auth)
    return next(errors.Unauthorized());

  if (req.body.from && req.body.from.fullname && req.body.from.email)
  {
    db.remove({name:'from'}, {}, function(err){
      db.insert({name:'from', fullname: req.body.from.fullname, email: req.body.from.email});
    });
  }
  return next();
};


module.exports = new Settings();
