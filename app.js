var config = process.env.NODE_ENV === 'production' 
  ? require('./config/config.prod') 
  : require('./config/config.dev');

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var compression = require('compression');
var mongoose = require('mongoose');

var index = require('./routes/index');
var api = require('./routes/api');

var app = express();

var db = mongoose.connect(config.DB_URI, function(err) {
  if (err) {
    console.error(err, 'Error Connecting to Database!');
    process.abort();
  } else {
    console.log('Database Connected Successfully. Build Something Awesome!')
  }
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(helmet());
app.use(compression());
app.use(favicon(path.join(__dirname, 'public/images/ico', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
