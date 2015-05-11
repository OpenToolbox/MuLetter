'use strict';

var nodemailer = require('nodemailer');

var errors = require('../errors');
var nedb = require('nedb'), db = new nedb(global.db_posts), db_subs = new nedb(global.db_subscribers), db_settings = new nedb(global.db_settings);

function Posts () {

  db.loadDatabase();
  this.nodemailerSettings = {};
  this.sending = {state:0};

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

Posts.prototype.post = function(req, auth, next) {

  if (!auth)
      return next(errors.Unauthorized());

  db.insert({subject:req.body.subject, body:req.body.body, draftDate: Date.now(), postDate: -1}, function(err, newDoc) {
    if (err || !newDoc)
      next(errors.Conflict());
    else
      next({posts: newDoc});
  });
  return;

};

Posts.prototype._send = function(from, emailTo, post, next) {

  var mailSettings = {
      from: from.name +' <' + from.email + '>',
      to: emailTo,
      subject: post.subject,
      html: post.body
  };

  nodemailer.createTransport(this.nodemailerSettings).sendMail(mailSettings, (function mailSent (err, info) {
    if (err)
      next({notifications: {error: err, date: Date.now(), posts:{_id: post.id, subject: post.subject}, to: emailTo}});
    else
      next({notifications: {date: Date.now(), posts:{_id: post.id, subject: post.subject}, to: emailTo}});

    this.sending.current++;
    if (this.sending.total >= this.sending.current)
    {
      // sent state
      db.update({_id: post._id}, {$set: {postDate:Date.now()}}, (function(err, num, doc) {
        if (!err)
          next({posts:doc});
        else
          next({posts:post});
        this.sending = {state: 0};
      }).bind(this));
    }
  }).bind(this));
  return;
}

Posts.prototype.patch = function(req, auth, next) {

  if (!auth)
    return next(errors.Unauthorized());

  if (this.sending.state)
    return next(errors.Conflict('a post is being sent'));

  var self = this;

  db.find({_id: req.body._id, postDate: -1}, function(err, doc){
    if (err || !doc)
      next(errors.Conflict('does not exist or already sent'));
    else
    {
      db_subs.loadDatabase(function(err) {
        if (err)
          next(errors.Conflict('can\'t load subscribers list'));
        else
        {
          db_subs.find({}, function(err, docs) {
            if (err || !docs)
              next(errors.Conflict('can\'t load subscribers list'));
            else
            {
              db_settings.loadDatabase(function(err) {
                if (!err)
                  next(errors.Conflict('can\'t load settings'));
                else
                {
                  db_settings.find({name: 'from'}, function(err, from) {
                    if (err || !from)
                      next(errors.Conflict('can\'t load settings'));
                    else
                    {
                      // lock the post to send
                      db.update({_id: doc._id}, {$set: {postDate:0}}, function(err, num, doc) {
                        if (err)
                          next(errors.Conflict('can\'t lock post to send'));
                        else
                        {
                          // sending state
                          next({posts:doc});
                          self.sending = {
                            state: 1,
                            total: docs.length,
                            current: 0
                          };
                          // loop all subscribers
                          for (var i = 0; i < docs.length; i += 1) {
                            self._send(from, docs[i].email, doc, next);
                          }

                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
  return;

};

Posts.prototype.delete =  function(req, auth, next) {

  if (!auth)
      return next(errors.Unauthorized());

  // remove all
  if (req.hashUrl[0] && req.hashUrl[0] == 'all')
  {
      db.remove({}, {multi: true}, function(err, numRemoved) {
        next({posts: numRemoved});
      });
      return;
  }

  if (!req.body._id)
    return next(errors.Conflict('does not exist'));

  db.remove({_id: req.body._id}, function(err, numRemoved) {
    if (err)
      next(errors.Conflict('does not exist'));
    else
      next();
  });
};

module.exports = new Posts();
