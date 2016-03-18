var express = require('express');
var router = express.Router();
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var db = require('knex');
var knex = require('../db/knex');
var jwt = require('jsonwebtoken');
var base64url = require("base64-url");
var PaypalTokenStrategy = require('passport-paypal-token');

passport.use(new PaypalTokenStrategy({
    clientID: 'ARPGDP8XfK_IilyUmwT2yDojtxHeFnvNPkOKem1of_2SMHm29fKlawvsiHF_hb6C8gw99kHfmR6TW_B6',
    clientSecret: 'EK-GsYpIupfZDiaSESNz_7nOFYwpTBnEu_ltEa9TkIGC1A50Nt2pCMkIt7pUhoUw0slbqAMarBWMsoyF',
    openid_redirect_uri: 'http://localhost:3000/paypal',
    passReqToCallback: true
}, function(req, accessToken, refreshToken, profile, next) {
    User.findOrCreate({'paypal.id': profile.id}, function(error, user) {
        return next(error, user);
    });
}));

passport.use(new GoogleStrategy({
    clientID: '584410631450-198uljradcms25p3nl7j8k4ghgnmjovu.apps.googleusercontent.com',
    clientSecret: 'Mp4vMZMwuvO9DLl-_DwVjplY',
    callbackURL: 'http://localhost:3000/auth/google/callback'
  },
  function(req, token, refreshToken, profile, done) {
    process.nextTick(function() {
      knex('user_table').where('oauthid', profile.id).first().then(function(user){
        if(user){
          return done(null, user);
        } else {
          // console.log(profile);
          return knex('user_table').returning('id').insert({
            oauthid: profile.id,
            first_name: profile.name.givenName,
            last_name: profile.name.familyName,
            email: profile.emails[0].value,
            user_image: profile.photos[0].value
          }, '*')
          .then(function(userid){
            console.log('created user', userid);
            return done(null, userid[0]);
          })
        }
      })
      .catch(function(err){
        if (err) return done(err);
      });
    });
  })
);

router.get('/google/callback', function(req, res, next) {
   passport.authenticate('google', function(err, user, info) {
     if (err) {
       next(err);
     } else if (user) {
       console.log('this is the user object: ', user);
       var token = jwt.sign(user, "123", {
         expiresIn:'1d',
       })
       var authUrl = "http://localhost:8080/#/validating/" + token;
       res.redirect(authUrl);
     } else if (info) {
       next(info);
     }
   })(req, res, next);
 });

 router.get('/google', passport.authenticate('google', {
     scope: 'email',
   }),
   function(req, res) {
     res.end('success')
   });
   router.get('/logout', function(req, res, next){
     req.logout();
     res.send('logged out')
   })

module.exports = router;
