var MailDev = require('maildev');
global.db_posts = 'test/db_posts.test.json';
global.db_subscribers = 'test/db_subscribers.test.json';
global.db_settings = 'test/db_settings.test.json';
global.name = 'MuLetter';
var nedb = require('nedb'), db = new nedb(global.db_posts), db_sub = new nedb(global.db_subscribers), db_set = new nedb(global.db_settings);
var Posts = require('../routes/posts');
var _ = console.log;

bindTest(init,2000);

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
  _ ("\n%s", email.text);
});

function bindTest(toBind, time){
  setTimeout(function() {
    _ (" ");
    toBind();
  }, (time? time: 1000));
}

function init() {
  db.loadDatabase(loadSettings);
}

function loadSettings() {
  db_set.loadDatabase(loadSubscribers);
}

function loadSubscribers() {
  db_sub.loadDatabase(loadDb);
}

function loadDb() {
  _ ("Adding emails to subscribers database...");
  _ ("name@outlook.com");
  db_sub.insert({email: 'name@outlook.com'});
  _ ("name@gmail.com");
  db_sub.insert({email: 'name@gmail.com'});
  _ ("name@yahoo.com");
  db_sub.insert({email: 'name@yahoo.com'});
  _ ("name@facebook.com");
  db_sub.insert({email: 'name@facebook.com'});
  _ ("name@free.fr");
  db_sub.insert({email: 'name@free.fr'});

  bindTest(addPosts);
}

function addPosts() {
  _ ("Add posts");
  _ ("#post()");
  _ ('it should add 2 drafts without error');

  var req = {body:{subject: 'First letter test', body: '<p>This is a <b>test</b></p>'}}
  var req2 = {body:{subject: 'Second letter test', body: '<p>This is a <i>second</i> <b>test</b></p>'}}
  _ ("draft1");
  _ (req);
  Posts.post(req, 1, function(data) {
    _ ('#return');
    _ (data)
    _ ("draft2");
    _ (req2);
    Posts.post(req2, 1, function(data) {
      _ ('#return');
      _ (data);

      bindTest(getPostsPublic);
    });
  });
}

function getPostsPublic() {
  _ ("Get posts public");
  _ ("#get()");
  _ ('it should return []');
  var req = {body:{}, hashUrl: [1]};
  Posts.get(req, 0, function(data) {
    _ ('#return');
    _ (data);
    bindTest(getPostsAuth);
  });
}

function getPostsAuth() {
  _ ("Get posts auth");
  _ ("#get()");
  _ ('it should return one draft');
  var req = {body:{}, hashUrl: [1]};
  Posts.get(req, 1, function(data) {
    _ ('#return');
    _ (data);
    bindTest(getPostsAuthSearch);
  });
}

function getPostsAuthSearch() {
  _ ("Get posts auth search");
  _ ("#get()");
  _ ('it should the second draft');
  var req = {body:{string:'second'}, hashUrl: []};
  Posts.get(req, 1, function(data) {
    _ ('#return');
    _ (data);
    bindTest(getPostsAuthSearch2);
  });
}

function getPostsAuthSearch2() {
  _ ("Get posts auth search 2");
  _ ("#get()");
  _ ('it should all drafts containing the word "this"');
  var req = {body:{string:'this'}, hashUrl: []};
  Posts.get(req, 1, function(data) {
    _ ('#return');
    _ (data);
    bindTest(sendPostDraft.bind(data.posts[0]._id));
  });
}

function sendPostDraft() {
  _ ("Send a post");
  _ ("#patch(%s)", this);
  _ ('it should send the first draft and lock all others sending');
  var req = {body:{_id:this.toString()}};
  _(req);
  Posts.patch(req, 1, function(data){
    _ ('#return');
    _(data);
    if (data && data.posts && (data.posts.postDate > 0))
      bindTest(sendPostDraftAgain.bind(data.posts._id));
  });
  Posts.patch(req, 1, function(data){
    _ ("Send again the same post");
    _(data);
  });
}

function sendPostDraftAgain() {
  _ ("Send a post again");
  _ ("#patch(%s)", this);
  _ ('it should not send the post and return an error');
  var req = {body:{_id:this.toString()}};
  _(req);
  Posts.patch(req, 1, function(data){
    _ ('#return');
    _(data);
    bindTest(deletePost.bind(req.body._id));
  });
}

function deletePost() {
  _ ("Delete a post");
  _ ("#delete(%s)", this);
  var req = {body:{_id:this.toString()}, hashUrl:[]};
  _(req);
  Posts.delete(req, 1, function(data){
    bindTest(deletePostCheck);
  });
}

function deletePostCheck() {
  _ ("Delete a post check");
  var req = {body:{}, hashUrl: []};
  Posts.get(req, 1, function(data) {
    _ (data);
    bindTest(deleteAllPosts);
  });
}

function deleteAllPosts() {
  _ ("Delete all posts");
  _ ("#delete(all)");
  var req = {hashUrl:['all']};
  _(req);
  Posts.delete(req, 1, function(data){
    _ ('#return');
    _(data);
    bindTest(deleteAllPostsCheck);
  });
}


function deleteAllPostsCheck() {
  _ ("Delete all posts check");
  var req = {body:{}, hashUrl: []};
  Posts.get(req, 1, function(data) {
    _ (data);
    var fs = require('fs');
    fs.unlinkSync(global.db_settings);
    fs.unlinkSync(global.db_subscribers);
    fs.unlinkSync(global.db_posts);
    _('ALL TESTS ARE DONE');
  });
}
