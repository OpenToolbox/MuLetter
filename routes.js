'use strict';

var fs = require('fs'), errors = require('./errors'), cursor, data,
emailRegExp = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

function initSchema (raw) {
  cursor = raw.cursor || 0;
  data = raw.data || new Array();
}

function writeSync () {
  fs.writeFileSync('./data.json', JSON.stringify({cursor: cursor, data: data}));
}

// Open JSON data
try {
  initSchema(JSON.parse(fs.readFileSync('./data.json')));
}
catch (ex) {
  console.log('[Exception]', ex);
  initSchema({});
  writeSync();
}

module.exports.add = function (req, auth, next) {

  var email = req.body.email;

  if (!email || email && !emailRegExp.test(email)) {
    return next(errors.Conflict('wrong email'));
  }

  if (data.indexOf(email) !== -1) {
    return next(errors.Conflict('already exists'));
  }

  data.push(email);
  writeSync();

  next({data: email});

};

module.exports.remove = function (req, auth, next) {

  if (!auth) {
    return next(errors.Unauthorized());
  }

  var email = req.body.email, index;

  if (!email || email && !emailRegExp.test(email)) {
    return next(errors.Conflict('wrong email'));
  }

  index = data.indexOf(email);

  if (index == -1) {
    return next(errors.Conflict('does not exist'));
  }

  // Reajust cursor if higher than the index found
  if (index < cursor) {
    cursor -= 1;
  }

  data.splice(index, 1);
  writeSync();

  next({data: email});

};

module.exports.import = function (req, auth, next) {

  if (!auth) {
    return next(errors.Unauthorized());
  }

  if (!req.body.data) {
    return next(errors.Conflict('data to import is empty'));
  }

  if (req.body.cursor) {

    var newCursor = parseInt(req.body.cursor, 10);

    if (isNaN(newCursor) || newCursor < 0) {
      return next(errors.Conflict('cursor must be a positive integer or equal to zero'));
    }

    cursor = newCursor;
  }

  data = data.slice(cursor, data.length);
  data = data.concat(req.body.data.split("\n"));
  cursor = 0;
  writeSync();

  next({data: data.join("\n")});

};

module.exports.export = function (req, auth, next) {

  if (!auth) {
    return next(errors.Unauthorized());
  }

  cursor = data.length;
  writeSync();

  next({data: data.join("\n")});

};

module.exports.empty = function (req, auth, next) {

  if (!auth) {
    return next(errors.Unauthorized());
  }

  cursor = 0;
  data = new Array();
  writeSync();

  next({data: ""});

};
