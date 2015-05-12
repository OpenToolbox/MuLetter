var Router = require('../router');
var _ = console.log;

function bindTest(toBind, time){
  setTimeout(function() {
    _ (" ");
    toBind();
  }, (time? time: 1000));
}

securityTests();

function securityTests(){
  _('Security tests');
  _('it should return an error');

  _('Private method');
  var req = {url: '/posts', method:'_send'};
  Router.send(req, 1, function(data) {
    _(data);
  });
  _ (" ");
  _('Unauthorized');
  var req = {url: '/posts', method:'PATCH'};
  Router.send(req, 0, function(data) {
    _(data);
  });
  _ (" ");
  _('Route does not exist');
  var req = {url: '/fakemethod/', method:'PATCH'};
  Router.send(req, 1, function(data) {
    _(data);
  });
  _ (" ");
  _('Method does not exist');
  var req = {body: [], url: '/settings/', method:'UPDATE'};
  Router.send(req, 1, function(data) {
    _(data);
  });
}
