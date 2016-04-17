var Router = require('../router'), log = console.log;

module.exports = function (){

  log('> Fake public url : /logposts');
  Router({url: '/logposts'}, 1, function(data) {
    log(data);
  });

  log('> Unsigned url : /export');
  Router({url: '/export'}, 0, function(data) {
    log(data);
  });

  log('> Signed url : /export');
  var req = {url: '/export'};
  Router(req, 1, function(data) {
    log(data);
  });

  log('> Fake signed url : /delete');
  Router({url: '/delete', 1, function(data) {
    log(data);
  });

}
