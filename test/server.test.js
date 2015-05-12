var request = require('request');
var ws = require('ws');
var _ = console.log;

function bindTest(toBind, time){
  setTimeout(function() {
    _ (" ");
    toBind();
  }, (time? time: 1000));
}
