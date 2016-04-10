'use strict';

module.exports.isEmail = isEmail;

function isEmail (email) {

  var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  return re.test(email);

}

module.exports.JSONParser = JSONParser;

function JSONParser(data) {

  try {
    var body = {}
    var rawBody = data.trim();

    if (rawBody) {
      body = JSON.parse(rawBody);
    }

  } catch (ex) {
    body = {error: ex};
  } finally {
    return body;
  }

}

module.exports.bodyParser = bodyParser;

function bodyParser(req, cb) {

  var buf = '';

  req.setEncoding('utf8');
  req.on('data', function(chunk) {
    buf += chunk;
  });

  req.on('end', function() {
    cb(JSONParser(buf));
  });

}
