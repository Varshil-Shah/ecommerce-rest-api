/* eslint-disable no-console */
const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (error) => {
  console.log('Uncaught Exception Occurred');
  console.log({ unhandledRejectionError: error });
  process.exit(1);
});

dotenv.config({
  path: './config.env',
});

const MONGO_DATABASE_URL = process.env.MONGO_DATABASE_URL.replace(
  'PASSWORD',
  process.env.MONGO_DATABASE_PASSWORD
).replace('USER', process.env.MONGO_DATABASE_USER);

console.log({ MONGO_DATABASE_URL });

mongoose
  .connect(MONGO_DATABASE_URL)
  .then(() => {
    console.log('Database connected successfully!');
  })
  .catch((error) => {
    console.error({ error });
    console.log('Error while connecting database!');
  });

const app = require('./app');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log('Server listening on port', PORT);
});

process.on('unhandledRejection', (error) => {
  console.log('Unhandled Rejection Occurred');
  console.log({ unhandledRejectionError: error });
  server.close(() => {
    process.exit(1);
  });
});
