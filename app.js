var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const http = require('http');
const { connectToMongoDB } = require('./config/db');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users.routes');
var reservationRouter = require('./routes/reservation.routes');
var notificationRouter = require('./routes/notification.routes');
var avisRouter = require('./routes/avis.routes');
var recommendationRouter = require('./routes/recommendation.routes');

var app = express();

require('dotenv').config();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/index', indexRouter);
app.use('/users', usersRouter);
app.use('/reservation', reservationRouter);
app.use('/notification', notificationRouter);
app.use('/avis', avisRouter);
app.use('/recommendation', recommendationRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

});

const server = http.createServer(app);
server.listen(process.env.PORT, () => {
  connectToMongoDB();
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
module.exports = app;
