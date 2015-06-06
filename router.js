'use strict';

// Global files
global.name = 'μLetter';

var path = require('path');
global.db_settings =  path.resolve('.')+'/db/db_settings.json';
global.db_subscribers =  path.resolve('.')+'/db/db_subscribers.json';
global.db_posts =  path.resolve('.')+'/db/db_posts.json';

// Routes
var routes = {};
routes.signin = require('./routes/signin');
routes.subscribers = require('./routes/subscribers');
routes.posts = require('./routes/posts');
routes.settings = require('./routes/settings');

// Config
var config = require('./config');
routes.signin.nodemailerSettings = {
  port: config.sendmail,
  debug: config.debug
};
routes.posts.nodemailerSettings = {
  port: config.sendmail,
  debug: config.debug
};

// Errors
var errors = require('./errors');

module.exports.send = function Router (req, auth, next) {

  var next = ((typeof next !== "function")? (function(data){}):next);

  // url and method must be defined
  if ((typeof req.url === 'undefined') || (typeof req.url !== 'string') || (typeof req.method === 'undefined') || (typeof req.method !== 'string'))
    return next(errors.NotFound());

  // parse url
  var parsedUrl = require('url').parse(req.url).pathname;
  // trim parsedUrl
  if (parsedUrl.charAt(0) == '/')
    parsedUrl = parsedUrl.substr(1, parsedUrl.length-1);
  if (parsedUrl.charAt(parsedUrl.length-1) == '/')
    parsedUrl = parsedUrl.substr(0, parsedUrl.length-1);

  // hash parsedUrl
  req.hashUrl = parsedUrl.split('/');

  // get route
  var route = req.hashUrl.shift();

  // get method / protect private methods
  var method = req.method.replace(/_/,'').toLowerCase();

  // prepare body
  if (!req.body || typeof req.body !== 'object' || (typeof req.body === 'object') && Array.isArray(req.body))
    req.body = {};

  if (typeof routes[route] === 'undefined' || typeof routes[route][method] === 'undefined')
    return next(errors.NotFound());

  routes[route][method](req, auth, next);

};
