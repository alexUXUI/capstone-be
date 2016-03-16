var express = require('express');
var router = express.Router();
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var db = require('knex');
var knex = require('../db/knex');
var jwt = require('jsonwebtoken');
var base64url = require("base64-url");

router.post('/submitpost', function(req, res, next){
  console.log('got your post! THanks a bumch!');
  res.redirect('index.html')
})


module.exports = router;
