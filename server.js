#!/bin/env node

var http = require('http'), 
path = require('path'), 
config = require('./config'), 
errors = require('./errors'), 
router = require('./router')
JSONParser = require('./tools').JSONParser, 
bodyParser = require('./tools').bodyParser;


http.createServer(function handleRequest(req, res) {
  
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
  // REST Methods and JSON
  res.setHeader("Access-Control-Allow-Methods", "POST, PUT, PATCH, DELETE");
  res.setHeader("Content-Type", "application/json");
   
  // Get request body
  bodyParser(req, function(body) {
    
    req.body = body;

    // If a key exists and matches the one in config.js, set auth to true
    var auth = (req.body.key == config.key) ? true : false;
   
    router.send(req, auth, function (data) {

      if ((typeof data === 'object') && data.statusCode) {
        res.statusCode = data.statusCode;
        delete data.statusCode;
      }
      res.end(JSON.stringify({'data':data}));
    
    });

  });

}).listen(config.port, config.host, function() {

  console.log('HTTP Server is running on : ' + config.host + ':' + config.port);

});
