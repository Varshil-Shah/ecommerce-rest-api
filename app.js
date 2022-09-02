const express = require('express');
const morgan = require('morgan');

const app = express();

// logging every request on console in development mode
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

module.exports = app;
