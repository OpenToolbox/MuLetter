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

// Errors
var errors = require('./errors');

module.exports.send = function Router (req, auth, next) {

  var next = ((typeof next !== "function")? (function(data){}):next);

  // parse url
  if ((typeof req.url === 'undefined') || (typeof req.url !== 'String') || (typeof req.method === 'undefined') || (typeof req.method !== 'String'))
    return next(errors.NotFound());
  var parsedUrl = require('url').parse(req.url).pathname;
  // protect private methods, clean query string, hash url
  req.hashUrl = parsedUrl.replace(/_/,'').trim('/').split('/');
  var route = req.hashUrl.shift();
  var method = req.method.toLowerCase();
  // prepare body
  if (!req.body || typeof req.body !== 'object')
    req.body = {};

  if (typeof routes[route] === 'undefined' || typeof routes[route][method] === 'undefined')
    return next(errors.NotFound());

  routes[route][method](req, auth, next);

};
