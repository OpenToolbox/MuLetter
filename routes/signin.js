'use strict';

var os = require('os');
var bcrypt = require('bcrypt'), crypto = require('crypto');
var nodemailer = require('nodemailer');

var errors = require('../errors');
var isEmail = require('../tools').isEmail;
var musession = require('musession');
var nedb = require('nedb'), settings = new nedb(global.db_settings);

function Signin () {

  settings.loadDatabase();
  this.nodemailerSettings = {};

}

Signin.prototype.constructor = Signin;

Signin.prototype._fetchAdmin = function (email, pwd, next) {

  settings.findOne({name: 'admin'}, function (err, doc) {

    if (err)
      return next(false);

    if (!doc)
      return next(false);

    if ((email != doc.email) || (!bcrypt.compareSync(pwd, doc.pwd)))
      return next(false);

    if (!doc.signed)
      settings.update({name: 'admin'}, {$set: {signed: 1}});

    next(true);

  });

};

Signin.prototype._emailErrors = function (email, next) {

  if (!email)
  {
    next(errors.Conflict('Email can\'t be blank'));
    return true;
  }

  if (!isEmail(email))
  {
    next(errors.Conflict('Wrong email'));
    return true;
  }
};

Signin.prototype._pwdErrors = function (pwd, next) {

  if (!pwd)
  {
    next(errors.Conflict('Pwd can\'t be blank'));
    return true;
  }
};


Signin.prototype.post = function (req, auth, next) {

  if (this._emailErrors(req.body.email, next))
    return;

  if (this._pwdErrors(req.body.pwd, next))
    return;

  this._fetchAdmin(req.body.email, req.body.pwd, function(admin) {

    if (!admin)
      return next(errors.Conflict(('Wrong email or password')));

    musession.secure(function(hash, expires) {
      next({session:{id: hash, 'expires': expires}});
    });

  });
};

Signin.prototype.get = function (req, auth, next) {

  if (!req.hashUrl[0])
    return next(errors.NotFound());
  
  var email = req.hashUrl[0];

  if (this._emailErrors(email, next))
    return;

  settings.findOne({name: 'admin'}, (function (err, doc) {

    if (err)
      return next(errors.Conflict('nedb', err));

    if (doc && doc.signed === 1)
        return next(errors.Conflict('Already signed in'));

    var randomPassword = crypto.randomBytes(16).toString('base64');

    var mailSettings = {
        from: global.name +' <noreply@' + os.hostname() + '>',
        to: email,
        subject: 'Authentication Password',
        text: 'E-mail : ' + email + "\n"+'Password : ' + randomPassword
    };

    nodemailer.createTransport(this.nodemailerSettings).sendMail(mailSettings, function mailSent (err, info) {

        if (err)
          return next(errors.Conflict('nodemailer', err));

        bcrypt.hash(randomPassword, 8, function (err, hash) {

          if (err)
            return next(errors.Conflict('bcrypt', err));

          if (!doc)
            settings.insert({name: 'admin', 'email': email, pwd: hash, signed: 0});

          else
            settings.update({name: 'admin'}, {$set: {'email': email, pwd: hash}});

          next();

        }); // bcrypt

    }); // nodemailer

  }).bind(this)); // nedb

};

module.exports = new Signin();
