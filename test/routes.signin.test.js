var path = require('path'), prompt = require('prompt'), MailDev = require('maildev');
global.db_settings = path.resolve('.')+'/test/db_settings.test.json';
var nedb = require('nedb'), settings = new nedb(global.db_settings);
var errors = require('../errors');
var Signin = require('../routes/signin');

Signin.nodemailerSettings = {
  port: 1025,
  ignoreTLS: true
};

var maildev = new MailDev({
  smtp: 1025,
  web: 1080,
  open: true
});

maildev.on('new', function(email){
  console.log("\n%s", email.text);
});

bindTest(SigninStep1,2000);

function bindTest(toBind, time){
  setTimeout(function() {
    console.log(" ");
    toBind();
  }, (time? time: 1000));
}

function SigninStep1(){
  console.log('Signin Step 1');
  prompt.start();
  prompt.get('email', function (err, result) {
    console.log('#get('+ result.email+ ')');
    console.log('it should generate a password and send it to '+ result.email+ ' without error');

    var req = {hashUrl:[result.email]};
    Signin.get(req, false, function done(data) {
      if (typeof data !== 'undefined') {
        console.log(data);
        return bindTest(SigninStep1);
      }
      else
      {
        return bindTest(SigninStep1Check.bind(result.email));
      }
    });
  });
}

function SigninStep1Check(){
  console.log('Signin Step 1 Check');
  settings.loadDatabase();
  settings.findOne({name:'admin'}, (function(err, doc){

    if (doc && (doc.email == this)) {
      console.log(doc);
      return bindTest(SigninStep1Again);
    }

    else {
      console.log('error: '+this+' has not been stored');
      return;
    }

  }).bind(this));
}

function SigninStep1Again(){
  console.log('Signin Step 1 Again (send another password)');
  prompt.start();
  prompt.get('email', function (err, result) {
    console.log('#get('+ result.email+ ')');
    console.log('it should generate a password and send it to '+ result.email+ ' without error');

    var req = {hashUrl:[result.email]};
    Signin.get(req, false, function done(data) {
      if (typeof data !== 'undefined') {
        console.log(data);
        return bindTest(SigninStep1);
      }
      else
        return bindTest(SigninStep1AgainCheck.bind(result.email));
    });
  });
}

function SigninStep1AgainCheck(){
  console.log('Signin Step 1 Again Check');
  settings.loadDatabase();
  settings.findOne({name:'admin'}, (function(err, doc){

    if (doc && (doc.email == this)) {
      console.log(doc);
      return bindTest(SigninStep2.bind(this));
    }

    else {
      console.log('error: '+this+' has not been stored');
      return;
    }

  }).bind(this));
}

function SigninStep2(){
  console.log('Signin Step 2 - '+ this);
  prompt.start();
  prompt.get('password', (function (err, result) {
    console.log('#post('+ this + ', '+result.password+')');
    console.log('it should sign in the admin account and lock any sign up without error');

    var req = {body:{}};
    req.body.email = this;
    req.body.pwd = result.password;

    Signin.post(req, false, (function done(data) {
      if ((typeof data !== 'undefined') && (typeof data.code !== 'undefined')) {
        console.log(data);
        return bindTest(SigninStep2.bind(this));
      }
      else
      {
        console.log(data);
        return bindTest(SigninStep1Finally.bind(this));
      }
    }).bind(this));
  }).bind(this));
}

function SigninStep1Finally(){
  console.log('Signin Step 1 Finally - '+ this);
  console.log('#get('+ this+ ')');
  console.log('it should return an error');

  var req = {hashUrl:[this]};
  Signin.get(req, false, function done(data) {
    if (data)
      console.log(data);
    require('fs').unlinkSync(global.db_settings);
    console.log('');
    console.log('ALL TESTS ARE DONE');
  });
}
