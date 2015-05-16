#!/bin/env node

// command dev mode : node server.js httpPort wsPort
var http = require('http'), httpPort = ((process.argv[2])? process.argv[2]:80);
var WebSocket = require('ws'), wss = new WebSocket.Server({port:((process.argv[2])? process.argv[2]:80)});
var router = require('./router');
var errors = require('./errors');
var JSONParser = require('./tools').JSONParser;
var bodyParser = require('./tools').bodyParser;
var path = require('path');
var musession = require('musession').setJSONfile(path.resolve('.')+'/db/db_sessions.json');

// Public Requests JSON-REST
http.createServer(function handleRequest(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  // REST Methods and JSON
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  res.setHeader("Content-Type", "application/json");
  // Get request body
  bodyParser(req, function(body) {
    req.body = body;
    router.send(req, false, function (data) {
      if ((typeof data === 'object') && data.statusCode)
      {
        res.statusCode = data.statusCode;
        delete data.statusCode;
      }
      res.end(JSON.stringify({'data':data}));
    });
  });
}).listen(httpPort);

// Auth Requests JSON-WebSockets
WebSocket.prototype.sendAuthorized = function() {
  router.send(this.req, true, (function(data) {
    if (data !== '')
    {
      this.res.data = data;
      this.send(JSON.stringify(this.res));
    }
  }).bind(this));
};
WebSocket.prototype.sendUnauthorized = function() {
  this.res.data = errors.Unauthorized();
  this.send(JSON.stringify(this.res));
  setTimeout((function timeout() {
    this.terminate();
  }).bind(this), 500);
};
wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(msg) {
    // Init req & res
    ws.req = JSONParser(msg);
    ws.res ={};
    // Check if a session exists
    //DEV
    ws.connection = 1;
    if (ws.connection)
      return ws.sendAuthorized();
    if (!ws.req.session || !ws.req.session.id)
      return ws.sendUnauthorized();
    musession.exists(ws.req.session.id, function(exists, hash, expires) {
      if (exists)
      {
        ws.connection = true;
        ws.res.session = {};
        ws.res.session.id = hash;
        ws.res.session.expires = expires;
        return ws.sendAuthorized();
      }

      return ws.sendUnauthorized();
    });
  });
});
