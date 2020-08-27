// Get secret variables
require('dotenv').config();

// dependencies
const express = require('express');
const session = require("express-session");
const passport = require('./auth');
const router = require('./routes/router');
const cors = require('cors');


// connect to mongodb database
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


// create app
const app = express();
app.use(express.json());

// setup authentication and session
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// make user object more easily available
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// allow cross-origin requests
app.use(cors(
  {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }
));

// setup router
app.use('/', router);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error
  err.status = 404;
  err.message = 'Not found';
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;