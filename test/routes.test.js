var routes = require('../routes'), log = console.log;

module.exports.add = function (email, cb){
  log('#add()', email);
  log('it should add %s to the json without error', email);

  var req = {body:{email: email}};
  routes.add(req, false, function done(data) {
    log(data);
    if (typeof cb === 'function') { return cb(); }
  });
}

module.exports.remove = function (email, cb){
  log('#remove()', email);
  log('it should remove %s to the json without error', email);

  var req = {body:{email: email}};
  routes.remove(req, false, function done(data) {
    log(data);
    if (typeof cb === 'function') { return cb(); }
  });
}

module.exports.import = function (cursor, cb){
  log('#import()', 'email1@gmx.com\nemail2@gmx.com\nemail3@gmx.com\nemail4@gmx.com');
  log('it should import the emails list without error');

  var req = {body:{data: "email1@gmx.com\nemail2@gmx.com\nemail3@gmx.com\nemail4@gmx.com" }};
  if (cursor != 'default') {
    req.body.cursor = cursor;
  }
  routes.import(req, true, function done(data) {
    log(data);
    if (typeof cb === 'function') { return cb(); }
  });
}

module.exports.export = function (cb){
  log('#export()');
  log('it should export the emails list without error');

  routes.export({}, true, function done(data) {
    log(data);
    if (typeof cb === 'function') { return cb(); }
  });
}

module.exports.empty = function (cb){
  log('#empty()');
  log('it should empty the json without error');

  routes.empty({}, true, function done(data) {
    log(data);
    if (typeof cb === 'function') { return cb(); }
  });
}
