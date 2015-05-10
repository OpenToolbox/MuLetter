'use strict';

var isEmail = require('../tools').isEmail;
var errors = require('../errors');
var nedb = require('nedb'), db = new nedb(global.db_subscribers);


function Subscribers()
{
  db.loadDatabase();
  db.ensureIndex({ fieldName: 'email', unique: true });
}

Subscribers.prototype.constructor = Subscribers;

Subscribers.prototype.get = function(req, auth, next) {

  if (!auth)
    return next(errors.Unauthorized());

  // pagination is empty - list subscribers
  if (!req.hashUrl[0] && !req.body.email)
  {
    var skip = 0;
    db.find({}, {'email': 1, _id: 0 }).sort({'email': 1}).skip(skip).limit(10).exec(function(err, docs){
      if(!err && docs)
        next({subscribers: docs});
      else
        next({subscribers: []});
    });
    return;
  }

  // pagination is set - list subscribers
  var skip = parseInt(req.hashUrl[0], 10);
  if ((typeof req.hashUrl[0] === 'number' || skip == req.hashUrl[0]) && !req.body.email)
  {
    db.find({}, {'email': 1, _id: 0 }).sort({'email': 1}).skip(skip).limit(10).exec(function(err, docs){
      if(!err && docs)
        next({subscribers: docs});
      else
        next({subscribers: []});
    });
    return;
  }

  // check if the first arg is a string
  if ((typeof req.hashUrl[0] !== 'string') && !req.body.email)
    return next(errors.NotFound());

  // export
  if (req.hashUrl[0] == 'export')
  {
    db.find({}, {_id: 0, 'email':1}, function(err, docs){
      if (err || !docs)
        return next(errors.Conflict('nothing to export', err));
      // convert to string
      var output = docs.shift().email;
      for (var key in docs)
      {
        output =  output + "\n"+ docs[key].email;
      }
      return next({subscribers: output});
    });
    return;
  }

  // search a specific mail
  if (req.body.email)
    var email = req.body.email;
  else
    var email = decodeURIComponent(req.hashUrl[0]);
  // pagination
  if (!req.hashUrl[1])
    var skip = 0;
  else
  {
    var skip = parseInt(req.hashUrl[1], 10);
    if ((typeof req.hashUrl[1] !== 'number') || (skip != req.hashUrl[1]))
      skip = 0;
  }
  var query = function() {
    return (this.email.indexOf(email) !== -1);
  };
  db.find({$where: query}, {'email': 1, _id: 0 }).sort({'email': 1}).skip(skip).limit(10).exec(function(err, docs){
    if(!err && docs)
      next({subscribers: docs});
    else
      next({subscribers: []});
  });
  return;
};

Subscribers.prototype.post = function(req, auth, next) {

  if (auth)
  {
      if (!req.body.subscribers)
        return next();

      var emailsArray = req.body.subscribers.split("\n");

      for (var key in emailsArray)
      {
        db.insert({'email':emailsArray[key]}, function(err){});
      }

      return next();
  }

  var email = req.body.email;

  if (!email || (email && !isEmail(email)))
    return next(errors.Conflict('wrong email'));

  db.insert({'email':email}, function(err) {
      if (err)
        next(errors.Conflict('already exists'));
      else
        next();
  });

};

Subscribers.prototype.put = function(req, auth, next) {
  if (!auth)
      return next(errors.Unauthorized());
};

Subscribers.prototype.delete = function(req, auth, next) {

  if (!auth)
      return next(errors.Unauthorized());

  // remove all
  if (req.hashUrl[0] && req.hashUrl[0] == 'all')
  {
      db.remove({}, { multi: true }, function(err, numRemoved) {
        next({subscribers: numRemoved});
      });
      return;
  }

  if (!req.body.email)
    return next(errors.Conflict('does not exist'));

  db.remove({email: req.body.email}, function(err, numRemoved) {
    if (err)
      next(errors.Conflict('does not exist'));
    else
      next();
  });
};

module.exports = new Subscribers();
