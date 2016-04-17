var request = require('request'),
config = require('../config'),
_ = console.log,
exec = require('child_process').exec,
routerTest = require('./router.test'),
routesTest = require('./routes.test');

function bindTest(toBind, time){
  setTimeout(function() {
    console.log(" ");
    toBind();
  }, (time? time: 1000));
}

// Router
routerTest();

// Routes

// Server
exec('node server.js', function serverTest() {
	request.post({url:config.host+'/export/', form: {key:config.key}}, function (err, response, body) {
		_(response);
	});
});
