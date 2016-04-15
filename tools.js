'use strict';

var fs = require('fs');

module.exports.isEmail = isEmail;

function isEmail (email) {

  var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  return re.test(email);

}

module.exports.jsonParser = jsonParser;

function jsonParser(data) {

  try {
    var body = {}
    var rawBody = data.trim();

    if (rawBody) {
      body = JSON.parse(rawBody);
    }

  }

  catch (ex) {
    body = {error: ex};
  }

  finally {
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
    cb(jsonParser(buf));
  });

}

module.exports.jsonOpen = jsonOpen;

function jsonOpen (fp) {

  if (!fp) {
    return;
  }

  this.fp = fp;

  try {
    console.log(require(this.fp));
    this.raw = this.initSchema(require(this.fp));
  }

  catch (ex) {
    this.raw = this.initSchema({});
    this.writeSync();
  }

}

jsonOpen.prototype.initSchema = function(raw) {

  return {
    cursor: raw.cursor || 0,
    data: raw.data || new Array()
  };

};

jsonOpen.prototype.writeSync = function() {

  fs.writeFileSync(this.fp, JSON.stringify(this.raw));

};
