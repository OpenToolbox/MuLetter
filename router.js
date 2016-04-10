'use strict';

var routes = require('./routes'), errors = require('./errors');

module.exports = function Router (req, auth, next) {

  var next = typeof next !== "function"? function(data){} : next;

  // url must be defined
  if (typeof req.url === 'undefined' || typeof req.url !== 'string') {
    return next(errors.NotFound());
  }

  // parse url
  var parsedUrl = require('url').parse(req.url).pathname;
  
  // trim parsedUrl
  if (parsedUrl.charAt(0) == '/') {
    parsedUrl = parsedUrl.substr(1, parsedUrl.length-1);
  }

  if (parsedUrl.charAt(parsedUrl.length-1) == '/') {
    parsedUrl = parsedUrl.substr(0, parsedUrl.length-1);
  }

  // hash parsedUrl
  req.hashUrl = parsedUrl.split('/');

  // get route
  var route = req.hashUrl.shift();

  // prepare body
  if (!req.body || typeof req.body !== 'object' || typeof req.body === 'object' && Array.isArray(req.body)) {
    req.body = {};
  }

  if (typeof routes[route] === 'undefined') {
    return next(errors.NotFound());
  }

  routes[route](req, auth, next);

};
