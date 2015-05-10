var path = require('path'), MailDev = require('maildev');
global.db_posts = path.resolve('.')+'/test/db_posts.test.json';
var nedb = require('nedb'), db = new nedb(global.db_posts);
var errors = require('../errors');
var Posts = require('../routes/posts');

Posts.nodemailerSettings = {
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

function bindTest(toBind, time){
  setTimeout(function() {
    console.log(" ");
    toBind();
  }, (time? time: 1000));
}

//bindTest(,2000);
