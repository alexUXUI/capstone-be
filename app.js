var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors= require('cors')
var auth = require('./routes/auth');
var routes = require('./routes/index');
var content = require('./routes/content');
var users = require('./routes/users');
var db = require('knex');
var knex = require('./db/knex');
var jwt = require('jsonwebtoken');
var app = express();
var base64url = require("base64-url")

// var passport = require('passport');
// var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Middleware!
// Will run before all other routes, because it is defined ABOVE all other routes

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use('/', routes);
app.use('/users', users);
app.use('/auth', auth);
app.use('/content', content);

app.use(tokenAuthenticated);

app.use('/getusers', function(req, res, next){
  knex('user_table').select().then(function(users){
    res.json({users: users})
  })
})

app.get('/postview/:id', function(req, res, next){
  var postId = req.params.id;
  knex('work').first().where('id', postId).then(function(post){
    res.json({post: post});
  })
})

app.get('/profile/:id', function(req, res, next){
  var userId = req.params.id;
  console.log('here\'s taht user id you wanted: ', userId);
  knex('user_table').first().where('id', userId).then(function(user){
    res.json({user: user})
  })
})

app.post('/submitpost', function(req, res, next){
  if(req.user){
    console.log('got your post! Thanks a bunch!');
    console.log('this is user id', req.user.id);
    var userID = req.user.id;
    knex('work').insert({
      title: req.body.title,
      text_content: req.body.text,
      image_content: req.body.images,
      hashtag: req.body.hashtags,
      for_sale: req.body.forsale || null,
      price: req.body.price || null,
      likes: '' || null,
      comments: '' || null,
      user_id: userID
    }, 'id').then(function(id){
      console.log(req.user.id);
      console.log(id);
      res.json({id: id})
    })
  } else {
    res.json({message: "unauthorized"});
  }
})

app.get('/allposts', function(req, res, next){
  knex('work').select().then(function(data){
    res.json({data: data})
  })
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

function tokenAuthenticated(req, res, next){
 var token = req.body.token || req.query.token || req.headers.token;
 if (token) {
   console.log('Got token', token);
   jwt.verify(token, "123", function(err, decoded) {
     if (err) {
       console.log(err);
       return res.json({ success: false, message: 'Failed to authenticate token.' });
     } else {
       console.log('token is good');
       req.user = decoded;
       console.log(decoded);
       next();
     }
   });
  } else {
 return res.status(403).send({
     success: false,
     message: 'No token provided.'
 });
 }
}

module.exports = app;
