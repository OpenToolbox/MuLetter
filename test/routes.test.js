var path = require('path'), prompt = require('prompt');
var jsonOpen = require('../tools').jsonOpen, config = require('../config');
var errors = require('../errors');
var routes = require('../routes');

new jsonOpen('../data.json');

bindTest(Add);

function bindTest(toBind, time){
  setTimeout(function() {
    console.log(" ");
    toBind();
  }, (time? time: 1000));
}

function Add(){
  console.log('Add an email');
  prompt.start();
  prompt.get('email', function (err, result) {
    console.log('#add()', result.email);
    console.log('it should add %s to the json without error', result.email);

    var req = {body:{email:result.email}};
    routes.add(req, false, function done(data) {
      console.log(data);
      return bindTest(Remove.bind(null, result.email));
    });
  });
}

function Remove(email){
  console.log('Remove an email');
  console.log('#remove()', email);
  console.log('it should remove %s to the json without error', email);

  var req = {body:{email:email}};
  routes.remove(req, false, function done(data) {
    console.log(data);
    return bindTest(Import);
  });
}

function Import(){
  console.log('Import emails - email1@gmx.com, email2@gmx.com...');
  console.log('#import()');
  console.log('it should import the emails list to the json without error');

  var req = {body:{data: "email1@gmx.com\nemail2@gmx.com\nemail3@gmx.com\nemail4@gmx.com" }};
  routes.import(req, true, function done(data) {
    console.log(data);
    return bindTest(Export);
  });
}

function Export(){
  console.log('Export emails');
  console.log('#export()');
  console.log('it should export the emails list to the json without error');

  routes.export({}, true, function done(data) {
    console.log(data);
    return bindTest(Empty);
  });
}

function Empty(){
  console.log('Empty json');
  console.log('#empty()');
  console.log('it should empty the json without error');

  routes.empty({}, true, function done(data) {
    console.log(data);
  });
}
