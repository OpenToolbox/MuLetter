var path = require('path');
var jdb = require('../tools').jdb();
var errors = require('../errors');
var routes = require('../routes');

module.exports.add = function (email, cb){
  console.log('Add an email');
  console.log('#add()', email);
  console.log('it should add %s to the json without error', email);

  var req = {body:{email: email}};
  routes.add(req, false, function done(data) {
    console.log(data);
    if (typeof cb === 'function') { return cb(); }
  });
}

module.exports.remove = function (email, cb){
  console.log('Remove an email');
  console.log('#remove()', email);
  console.log('it should remove %s to the json without error', email);

  var req = {body:{email: email}};
  routes.remove(req, false, function done(data) {
    console.log(data);
    if (typeof cb === 'function') { return cb(); }
  });
}

module.exports.import = function (cb){
  console.log('Import emails - email1@gmx.com, email2@gmx.com...');
  console.log('#import()');
  console.log('it should import the emails list to the json without error');

  var req = {body:{data: "email1@gmx.com\nemail2@gmx.com\nemail3@gmx.com\nemail4@gmx.com" }};
  routes.import(req, true, function done(data) {
    console.log(data);
    if (typeof cb === 'function') { return cb(); }
  });
}

module.exports.export = function (cb){
  console.log('Export emails');
  console.log('#export()');
  console.log('it should export the emails list to the json without error');

  routes.export({}, true, function done(data) {
    console.log(data);
    if (typeof cb === 'function') { return cb(); }
  });
}

module.exports.empty = function (cb){
  console.log('Empty json');
  console.log('#empty()');
  console.log('it should empty the json without error');

  routes.empty({}, true, function done(data) {
    console.log(data);
    if (typeof cb === 'function') { return cb(); }
  });
}
