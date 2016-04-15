var request = require('request');
var config = require('../config');
var _ = console.log;
var exec = require('child_process').exec;

require('./router.test');
require('./routes.test');

exec('node server.js', function serverTest() {

	request.post({url:config.host+'/export/', form: {key:config.key}}, function (err, response, body) {
		_(response);
	});
});
