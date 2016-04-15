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
  var req = {url: '/_posts'};
  Router(req, 1, function(data) {
    _(data);
  });
  _ (" ");
  _('Unauthorized');
  var req = {url: '/export'};
  Router(req, 0, function(data) {
    _(data);
  });
  _ (" ");
  _('Route does not exist');
  var req = {url: '/fakemethod/'};
  Router(req, 1, function(data) {
    _(data);
  });
}
