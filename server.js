/* eslint-disable no-console */
process.on('uncaughtException', (error) => {
  console.log('Uncaught Exception Occurred');
  console.log({ unhandledRejectionError: error });
  process.exit(1);
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