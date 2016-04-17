#!/bin/env node

var http = require('http'),
config = require('./config'),
errors = require('./errors'),
router = require('./router');

http.createServer(function handleRequest(req, res) {

  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  // REST Methods and JSON
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Content-Type", "application/json");

  // Body Parser
  var buffer = '';
  req.setEncoding('utf8');
  req.on('data', function(chunk) {
    buffer += chunk;
  });

  req.on('end', function() {

    try {
      req.body = JSON.parse(buffer.trim());
    }

    catch (ex) {
      console.log('[Exception]', ex);
      req.body = {};
    }

    finally {

      // Authentication
      var auth = req.body.key == config.key ? true : false;

      router(req, auth, function (data) {

        // Errors Status Code
        if (typeof data === 'object' && data.errors && data.code) {
          res.statusCode = errors[data.code];
        }

        // Send JSON data
        res.end(JSON.stringify(data));

      });

    }

  });

}).listen(config.port, config.host, function() {

  console.log('HTTP(S) Server is running on : ' + config.host + ':' + config.port);

});
