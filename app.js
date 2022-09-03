const express = require('express');
const morgan = require('morgan');

const app = express();

const userRoute = require('./routes/user-route');
const categoryRoute = require('./routes/category-route');

app.use(express.json({ limit: '15kb' }));

// logging every request on console in development mode
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use('/api/v1/users', userRoute);
app.use('/api/v1/categories', categoryRoute);

app.use('*', (req, res, next) => {
  // eslint-disable-next-line no-console
  res.send({ message: `Cannot found ${req.originalUrl} on server.` });
});

module.exports = app;
