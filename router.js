'use strict';

var routes = require('./routes'), errors = require('./errors');

module.exports = function Router (req, auth, next) {

  var route, parsedUrl = require('url').parse(req.url).pathname;

  // trim parsedUrl
  if (parsedUrl.charAt(0) == '/') {
    parsedUrl = parsedUrl.substr(1, parsedUrl.length - 1);
  }

  if (parsedUrl.charAt(parsedUrl.length -1 ) == '/') {
    parsedUrl = parsedUrl.substr(0, parsedUrl.length - 1);
  }

  // hash parsedUrl
  req.hashUrl = parsedUrl.split('/');

  // get route
  route = req.hashUrl.shift();

  if (typeof routes[route] === 'undefined') {
    return next(errors.NotFound());
  }

  next = typeof next !== 'function' ? function (data) {} : next;
  routes[route](req, auth, next);

};
