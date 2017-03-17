var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');

var url = 'mongodb://localhost:27017/test';
require('./models/Route');

var RouteModel = mongoose.model('Route');

mongoose.connect(url, function(err) {
  if (err) throw err;
  console.log('connected');
  new RouteModel({
    cords:  { type: 'MultiLineString',
      coordinates: [
        [
          [
            100.0,
            0.0
          ],
          [
            101.0,
            1.0
          ]
        ],
        [
          [
            102.0,
            2.0
          ],
          [
            103.0,
            3.0
          ]
        ]
      ]
    },
    name: "r1"
  }).save(function(err, rt){
    if(!err){
      RouteModel.find({cords: {$near: {
        $geometry : {
          type : "Point" ,
          coordinates : [-179, 0] },
        $maxDistance : 5000
      }}}, function(err, rt2){
        if(err){
          console.log('err3');
        }else{
          console.log(rt2);
        }
      })
    }else{
      console.log("err!")
    }
  });
});



var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

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
