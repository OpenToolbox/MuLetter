var path = require('path'), prompt = require('prompt');
global.db_subscribers = path.resolve('.')+'/test/db_subscribers.test.json';
var nedb = require('nedb'), db = new nedb(global.db_subscribers);
var errors = require('../errors');
var Subscribers = require('../routes/subscribers');

db.loadDatabase();
bindTest(AddSubscriber);

function bindTest(toBind, time){
  setTimeout(function() {
    console.log(" ");
    toBind();
  }, (time? time: 1000));
}

function AddSubscriber(){
  console.log('Add a subscriber');
  prompt.start();
  prompt.get('email', function (err, result) {
    console.log('#post()', result.email);
    console.log('it should add %s to the db without error', result.email);

    var req = {body:{email:result.email}};
    Subscribers.post(req, false, function done(data) {
      if (typeof data !== 'undefined') {
        console.log(data);
        return bindTest(AddSubscriber);
      }
      else
      {
        return bindTest(AddSubscriberCheck.bind(result.email));
      }
    });
  });
}

function AddSubscriberCheck(){
  console.log('Add a subscriber Check - %s', this);
  db.loadDatabase();
  db.find({}, {'email':1}, (function(err, doc){

    if (doc) {
      console.log(doc);
      return bindTest(InsertSeveralSubscribers);
    }

    else {
      console.log('error: %s has not been stored', doc);
      return;
    }

  }).bind(this));
}

function InsertSeveralSubscribers(){
  console.log('Insert Several Subscribers - email1@gmx.com, email2@gmx.com...');
  console.log('#post()');
  console.log('it should add the emails to the db without error');

  var req = {body:{subscribers:"email1@gmx.com\nemail2@gmx.com\nemail3@gmx.com\nemail4@gmx.com" }};
  Subscribers.post(req, true, function done(data) {
    if (typeof data !== 'undefined') {
      console.log(data);
      return bindTest(InsertSeveralSubscribers);
    }
    else
    {
      return bindTest(InsertSeveralSubscribersCheck);
    }
  });
}

function InsertSeveralSubscribersCheck(){
  console.log('Insert Several Subscribers - email1@gmx.com, email2@gmx.com...');
  db.loadDatabase();
  db.find({}, function(err, docs){

    if (docs) {
      console.log(docs);
      return bindTest(DeleteASubscriber);
    }

    else {
      console.log('error: no emails stored');
      return;
    }

  });
}

function DeleteASubscriber(){
  console.log('Delete a subscriber - email2@gmx.com');
  console.log('#delete()');
  console.log('it should remove the email from the db without error');

  var req = {hashUrl:[], body:{email:'email2@gmx.com'}};
  Subscribers.delete(req, true, function done(data) {
    if (typeof data !== 'undefined') {
      console.log(data);
      return;
    }
    else
    {
      return bindTest(DeleteASubscriberCheck);
    }
  });
}

function DeleteASubscriberCheck(){
  console.log('Delete a subscriber Check - email2@gmx.com');
  db.loadDatabase();
  db.find({}, function(err, docs){
    if (err) {
      console.log(err);
    }
    else if (docs) {
      console.log(docs);
    }
    return bindTest(GetASubscriberWhoNotExists);
  });
}

function GetASubscriberWhoNotExists(){
  console.log('Get a subscriber who not exists - email2@gmx.com');
  console.log('#get()');
  console.log('It should return []');
  var req = {hashUrl:[encodeURIComponent('email2@gmx.com')]};
  req.body = {};
  Subscribers.get(req, true, function(data) {
      if (data)
      {
        console.log(data);
      }
      return bindTest(GetSubscribersWhoExist);
  });
}

function GetSubscribersWhoExist(){
  console.log('Get subscribers who exists - :name@gmx.com');
  console.log('#get()');
  console.log('It should return an email list');
  var req = {hashUrl:[encodeURIComponent('@gmx.com'), 0]};
  req.body = {};
  Subscribers.get(req, true, function(data) {
      if (data)
      {
        console.log(data);
      }
      return bindTest(ExportSubscribers);
  });
}

function ExportSubscribers(){
  console.log('Export Subscribers');
  console.log('#get(export)');
  console.log('It should return a string email list');
  var req = {hashUrl:['export']};
  Subscribers.get(req, true, function(data) {
      if (data)
      {
        console.log(data);
      }
      return bindTest(DeleteAllSubscribers);
  });
}

function DeleteAllSubscribers(){
  console.log('Delete All Subscribers');
  console.log('#delete(all)');
  console.log('It should delete all emails and return number of removed');
  var req = {hashUrl:['all']};
  Subscribers.delete(req, true, function(data) {
      if (data)
      {
        console.log(data);
      }
      return bindTest(DeleteAllSubscribersCheck);
  });
}

function DeleteAllSubscribersCheck(){
  console.log('Delete All Subscribers Check');
  console.log('It should return nothing');
  db.loadDatabase();
  db.find({}, function(err, docs){
    if (err) {
      console.log(err);
    }
    else if (docs) {
      console.log(docs);
    }
    require('fs').unlinkSync(global.db_subscribers);
    console.log('');
    console.log('ALL TESTS ARE DONE');
  });
}
