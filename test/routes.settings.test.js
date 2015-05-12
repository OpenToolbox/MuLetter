global.name = 'MuLetter';
global.db_settings = 'test/db_settings.test.json';
var nedb = require('nedb'), db = new nedb(global.db_settings);
var errors = require('../errors');
var Settings = require('../routes/settings');
var _ = console.log;

bindTest(init);

function bindTest(toBind, time){
  setTimeout(function() {
    _(" ");
    toBind();
  }, (time? time: 1000));
}

function init(){
  db.loadDatabase(function(err){
    if (err)
      _('Can\'t load settings database')
    else
      bindTest(getSettings);
  });
}

function getSettings(){
  _('Get Settings');
  _('#get');
  _('it should return globale.name (MuLetter) as fullname and a generic email');
  Settings.get({}, 1, function(data){
    _(data);
    bindTest(editSettings);
  });
}

function editSettings(){
  _('EditSettings');
  _('#post()');
  _('Fullname: My Name, Email: myname@gmail.com');
  var req = {body: {from: {fullname:'My Name', email: 'myname@gmail.com'}}};
  Settings.post(req, 1, function(data){
    bindTest(checkEditSettings);
  });
}

function checkEditSettings(){
  _('Check Edit Settings');
  _('#get');
  Settings.get({}, 1, function(data){
    _(data);
    _('ALL TESTS ARE DONE');
    require('fs').unlink(global.db_settings);
  });
}
