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

const cors = require('cors');

var app = express();

require('dotenv').config();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({origin: 'http://localhost:3000'}));

app.use('/index', indexRouter);
app.use('/users', usersRouter);
app.use('/api/reservations', reservationRouter);
app.use('/notification', notificationRouter);
app.use('/avis', avisRouter);
app.use('/recommendation', recommendationRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler

app.use(function (err, req, res, next) {
  const status = err.status || err.statusCode || 500;

  res.status(status).json({
    message: err.message || 'Internal Server Error',
    ...(req.app.get('env') === 'development' && {
      stack: err.stack
    })
  });
});

const server = http.createServer(app);
server.listen(process.env.PORT, '0.0.0.0', () => {
  connectToMongoDB();
  console.log(`Server is running on http://0.0.0.0:${process.env.PORT}`);
});
module.exports = app;
