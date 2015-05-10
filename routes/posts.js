'use strict';

var os = require('os');
var nodemailer = require('nodemailer');

var errors = require('../errors');
var nedb = require('nedb'), db = new nedb(global.db_posts);

function Posts () {

  db.loadDatabase();
  this.nodemailerSettings = {};

}

Posts.prototype.constructor = Posts;

Posts.prototype.get = function(req, auth, next) {

  // if auth params request are differents
  if (!auth)
  {
    var query = function() {
      return (this.postDate > 0);
    };
    var filters = {$where: query};
    var projections = {_id: 0, postDate: 1, draftDate: 0, object: 1, body: 1};
    var sort = {postDate: -1};
  }
  else
  {
    var filters = {};
    var projections = {_id: 1, postDate: 1, draftDate: 1, object: 1, body: 1};
    var sort = {draftDate: -1, postDate: -1};
  }

  // pagination is empty - list posts
  if (!req.hashUrl[0] && !req.body.string)
  {
    var skip = 0;
    db.find(filters, projections).sort(sort).skip(skip).limit(10).exec(function(err, docs){
      if(!err && docs)
        next({posts: docs});
      else
        next({posts: []});
    });
    return;
  }

  // pagination is set - list posts
  var skip = parseInt(req.hashUrl[0], 10);
  if ((typeof req.hashUrl[0] === 'number' || skip == req.hashUrl[0])  && !req.body.string)
  {
    db.find(filters, projections).sort(sort).skip(skip).limit(10).exec(function(err, docs){
      if(!err && docs)
        next({posts: docs});
      else
        next({posts: []});
    });
    return;
  }

  // check if auth
  if (!auth)
    return next(errors.Unauthorized());

  // check if the first arg is a string
  if ((typeof req.hashUrl[0] !== 'string') && !req.body.string)
    return next(errors.NotFound());

  // export
  /*
  if (req.hashUrl[0] == 'export')
  {
    db.find({}, {}, function(err, docs){
      if (err || !docs)
        return next(errors.Conflict('nothing to export', err));
      // convert to string
      var output = docs.shift();
      for (var key in docs)
      {
        //output =  output + "\n"+ ;
      }
      return next({posts: output});
    });
    return;
  }*/

  // search a specific string
  if (req.body.string)
    var string = req.body.string;
  else
    var string = decodeURIComponent(req.hashUrl[0]);
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
    return (this.object.indexOf(string) !== -1) || (this.body.indexOf(string) !== -1);
  };
  db.find({$where: query}, projections).sort(sort).skip(skip).limit(10).exec(function(err, docs){
    if(!err && docs)
      next({posts: docs});
    else
      next({posts: []});
  });
  return;
};

Posts.prototype.post = function() {};

Posts.prototype.put = function() {};

Posts.prototype.path = function() {};

Posts.prototype.delete = function() {};

module.exports = new Posts();
