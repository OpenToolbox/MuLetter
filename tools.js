'use strict';

var fs = require('fs'), jdbInstance;

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

module.exports.jdb = jdbSingleton;

function jdb () {

  try {
    this.initSchema(JSON.parse(fs.readFileSync('./data.json')));
  }

  catch (ex) {
    this.initSchema({});
    this.writeSync();
  }

}

jdb.prototype.initSchema = function(raw) {

  this.cursor = raw.cursor || 0;
  this.data = raw.data || new Array();

};

jdb.prototype.writeSync = function() {

  fs.writeFileSync('./data.json', JSON.stringify({cursor: this.cursor, data: this.data}));

};

function jdbSingleton() {
  if (typeof jdbInstance === 'object') {
    return jdbInstance;
  }
  else {
    jdbInstance = new jdb();
    return jdbInstance;
  }
}
