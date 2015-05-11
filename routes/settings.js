'use strict';

var os = require('os');
var bcrypt = require('bcrypt'), crypto = require('crypto');
var nodemailer = require('nodemailer');

var errors = require('../errors');
var isEmail = require('../tools').isEmail;
var nedb = require('nedb'), db = new nedb(global.db_settings);

function Settings () {

  db.loadDatabase();
  this.nodemailerSettings = {};

}

Settings.prototype.constructor = Settings;

Settings.prototype.get = function() {};

Settings.prototype.post = function() {};

Settings.prototype.put = function() {};

Settings.prototype.patch = function() {};

Settings.prototype.delete = function() {};


module.exports = new Settings();
