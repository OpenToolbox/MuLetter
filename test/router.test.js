var Router = require('../router'), _ = console.log;

module.exports = function (){
  _('Fake public url : /_posts');
  var req = {url: '/_posts'};
  Router(req, 1, function(data) {
    _(data);
  });
  _ (" ");
  _('Unsigned url : /export');
  var req = {url: '/export'};
  Router(req, 0, function(data) {
    _(data);
  });
  _ (" ");

  _('Signed url : /export');
  var req = {url: '/export'};
  Router(req, 1, function(data) {
    _(data);
  });
  _ (" ");

  _('Fake signed url : /delete');
  var req = {url: '/delete'};
  Router(req, 1, function(data) {
    _(data);
  });
  _ (" ");

}
