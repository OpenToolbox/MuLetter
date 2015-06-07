var request = require('request');
var ws = require('ws');
var config = require('../config');
var _ = console.log;
var exec = require('child_process').exec;

exec('node test/routes.signin.test.js', function() {
	
	exec('node test/routes.subscribers.test.js', function() {
		
		exec('node test/routes.posts.test.js', function() {
			
			exec('node test/routes.settings.test.js', function() {
				exec('node server.js', serverTest);
			});
			
		});
	
	});

});


function serverTest() {
	
	request.get({url:config.host+'/signin/fake@muletter.com'}, function (err, response, body) {
		_(response);
	});
	
	request.post({url:config.host+'/subscribers/', form: {email:'fake@muletter.com'}}, function(err,httpResponse,body){ 
		_(response);
	});
	
	var ss = new ws('ws://'+config.host+':8000');

	ss.on('open', function open() {
	
		var msg = {
			"method": "GET",
			"url": "/subscribers",
			"session": {
				"id": "blablablba"
			}
		}
		ss.send(JSON.stringify(msg));
	});

	ss.on('message', function(data, flags) {
	  _(data);
	});
}

