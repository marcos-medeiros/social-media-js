// Get secret variables
require('dotenv').config();

// dependencies
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./graphql/schema');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require("helmet");

// create app
var app = express();

// allow cross-origin requests
app.use(cors(
  {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }
));

// sets http headers to improve security of requests
app.use(helmet());

// connect to mongodb database
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// bind express with graphql
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));


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