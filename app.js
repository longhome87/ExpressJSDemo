const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fileUpload = require('express-fileupload');

const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);

const env = process.env.NODE_ENV || 'development';
const config = require('./config')[env];
const pg = require('pg');
const pgPool = new pg.Pool({
  connectionString: config.connectionString
});

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const customersRouter = require('./routes/customers');
const productsRouter = require('./routes/products');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());
app.use(session({
  store: new pgSession({
    pool: pgPool
  }),
  secret: 'minishop_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}));

app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/customers', customersRouter);
app.use('/products', productsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;