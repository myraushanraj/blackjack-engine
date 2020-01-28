require('dotenv').config();
require('./database/connection');
var createError = require('http-errors');
var express = require('express');
var app = express();
var expressValidator = require('express-validator');
app.use(expressValidator());

var morgan = require('morgan');
var fs = require('fs');
var path = require('path');


//Route File
var apiRouter = require('./routes/api');
var gameEngine = require('./routes/gameEngine');


//parsing the body of incoming HTTP requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Morgan for logger (Every request save in access.log file)
// eslint-disable-next-line no-undef
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs/access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

// api routes
app.use('/api', apiRouter);
app.use('/game', gameEngine);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});








module.exports = app;
