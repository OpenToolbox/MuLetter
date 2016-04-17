var request = require('request'),
config = require('../config'),
log = console.log,
serverUrl = 'http://'+config.host+':'+config.port;


// Server
log('> server.js');
require('../server');

request.get({
    url: serverUrl + '/'
}, function (err, response, body) {
  log('> GET /');
  if (err) {
    log(err);
  }
  if (body) {
    log('Return', body);
  }
});

request.put({
    url: serverUrl + '/'
}, function (err, response, body) {
  log('> PUT /');
  if (err) {
    log(err);
  }
  if (body) {
    log('Return', body);
  }
});


request.post({
    url: serverUrl + '/export',
    form: {key:'fake'}
}, function (err, response, body) {
  log('> POST /export', 'Unauthorized');
  if (err) {
    log(err);
  }
  if (body) {
    log('Return', body);
  }
});

request.post({
    url: serverUrl + '/import',
    form: {key:config.key, data:'kim@gmail.com\nkim2@gmail.com'}
}, function (err, response, body) {
  log('> POST /import', 'kim@gmail.com,kim2@gmail.com');
  if (err) {
    log(err);
  }
  if (body) {
    log('Return', body);
  }
});


request.post({
    url: serverUrl + '/add',
    form: {email:'kim@gmail.com'}
}, function (err, response, body) {
  log('> POST /add', 'kim@gmail.com');
  if (err) {
    log(err);
  }
  if (body) {
    log('Return', body);
  }
});

request.post({
    url: serverUrl + '/add',
    form: {email:'kim@outlook.com'}
}, function (err, response, body) {
  log('> POST /add', 'kim@outlook.com');
  if (err) {
    log(err);
  }
  if (body) {
    log('Return', body);
  }
});

request.post({
    url: serverUrl + '/add',
    form: {email:'kim@yahoo.com'}
}, function (err, response, body) {
  log('> POST /add', 'kim@yahoo.com');
  if (err) {
    log(err);
  }
  if (body) {
    log('Return', body);
  }
});

request.post({
    url: serverUrl + '/remove',
    form: {key:config.key, email:'kim2@gmail.com'}
}, function (err, response, body) {
  log('> POST /remove', 'kim2@gmail.com');
  if (err) {
    log(err);
  }
  if (body) {
    log('Return', body);
  }
});

request.post({
    url: serverUrl + '/export',
    form: {key:config.key}
}, function (err, response, body) {
  log('> POST /export');
  if (err) {
    log(err);
  }
  if (body) {
    log('Return', body);
  }
});

request.post({
    url: serverUrl + '/empty',
    form: {key:config.key}
}, function (err, response, body) {
  log('> POST /empty');
  if (err) {
    log(err);
  }
  if (body) {
    log('Return', body);
  }
});
