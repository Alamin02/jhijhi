const express = require('express');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const { join } = require('path');
const { existsSync } = require('fs');
const cors = require('cors');
const onFinished = require('on-finished');

const logger = require('./logger');
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const playersRouter = require('./routes/players');
const teamsRouter = require('./routes/teams');
const matchesRouter = require('./routes/matches');
const umpiresRouter = require('./routes/umpires');
const config = require('./config');

const app = express();

for (let configKey of Object.keys(config)) {
  app.set(configKey, config[configKey]);
}

require('./db')(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(join(__dirname, '..', '..', 'public')));
if (app.get('env') === 'development') {
  app.use(express.static(join(__dirname, '..', '..', 'statics')));
}

app.use(function (request, response, next) {
  const ping = Date.now();
  onFinished(response, (err) => {
    const pong = Date.now();
    const elapsed = (pong - ping) / 1000;
    logger.info(`${(new Date()).toUTCString()} | ${request.method} ${request.originalUrl} ${response.statusCode} ${elapsed.toFixed(2)}s`, request.body, response.body);
    if (err) {
      logger.error(err);
    }
  });
  next();
});

/**
 * If any page is requested, fall back to index.html
 * and let react to load the page
 */
app.use(function (request, response, next) {
  const path = join(__dirname, '..', '..', 'public', 'index.html');
  if (!request.originalUrl.startsWith('/api') && existsSync(path)) {
    return response.sendFile(path);
  }
  return next();
});


require('./authentication')(app);

app.use('/api', indexRouter);
app.use('/api/auth', authRouter);
app.use('/api/players', playersRouter);
app.use('/api/teams', teamsRouter);
app.use('/api/matches', matchesRouter);
app.use('/api/umpires', umpiresRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
// noinspection JSUnusedLocalSymbols
app.use(function (err, req, res, next) {
  // generate the error
  res.status(err.status || 500);
  const error = {};

  Object.getOwnPropertyNames(err).forEach(function (key) {
    error[key] = err[key];
  });

  error.stack = error.stack.split("\n").map(str => str.trim());

  // only providing error in development
  res.json({
    message: error.message,
    error: req.app.get('env') === 'development' ? error : {},
  });
});

module.exports = app;
