var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require('express-session');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// ================================
// DATABASE INIT && CONNECT
// ================================
var mongoose = require('mongoose');
var mongo_uri = require('mongodb-uri');

mongoose.connect(mongo_uri.formatMongoose('mongodb://localhost:27017') , function(err){
	if(err){
		console.log('DB CONNECT FAILED TO ' + mongo_uri.formatMongoose('mongodb://localhost:27017'));
	}
	else{
		console.log("DB CONNECTED");
	}
});

// ================================
// PASSPORT INIT
// ================================
var passport = require('passport');
var flash = require('connect-flash');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/bower" , express.static(path.join(__dirname , "/bower_components")));


// ================================
// PASSPORT SETUP
// ================================
app.use(session({ 
	secret : "GOMJA-WHISTLE-SECRET" ,
	resave: true,
    saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require("./config/passport")(passport);

// ================================
// ROUTER 
// ================================
app.use('/', routes);
app.use('/users', users(passport));


// ================================
// API ROUTER
// ================================
var route_api = {
	users : require('./routes/API/users.js')
}
app.use('/API/users' , route_api.users(passport));

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


module.exports = app;
