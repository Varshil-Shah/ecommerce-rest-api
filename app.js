const express = require('express');
const morgan = require('morgan');

const app = express();

// logging every request on console in development mode
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use('*', (req, res, next) => {
  // eslint-disable-next-line no-console
  res.send({ message: `Cannot found ${req.originalUrl} on server.` });
});

module.exports = app;
