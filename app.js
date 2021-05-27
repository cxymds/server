var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql');
var myConnection = require('express-myconnection');
var expressJwt = require('express-jwt')
var cors = require('cors');

var dbConfig = require('./config/db')
var config = require('./config/config')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var bookRouter = require('./routes/book');
var vueRouter = require('./routes/vue');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressJwt({
  secret: config.SCRET_KEY,  // 签名的密钥 或 PublicKey
  algorithms:['HS256']
}).unless({
  path: ['/','/login','/vue/login']  // 指定路径不经过 Token 解析
}));
app.use(myConnection(mysql, dbConfig.mysql, 'single'));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/book', bookRouter);
app.use('/vue', vueRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
