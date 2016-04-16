var request = require('request');
var config = require('../config');
var _ = console.log;
var exec = require('child_process').exec;

bindTest(Add);

function bindTest(toBind, time){
  setTimeout(function() {
    console.log(" ");
    toBind();
  }, (time? time: 1000));
}

//require('./routes.test');

//Remove.bind(null, result.email)
exec('node server.js', function serverTest() {

	request.post({url:config.host+'/export/', form: {key:config.key}}, function (err, response, body) {
		_(response);
	});
});
