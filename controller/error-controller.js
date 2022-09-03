const AppError = require('../utils/app-error');
const StatusCode = require('../utils/status-code');

// Error handlers
const handleDuplicateFieldDB = (error) => {
  const value = error.keyValue;
  const message = `Duplicate field value(s) for ${JSON.stringify(
    value
  )}.Please use another value`;
  return new AppError(message, StatusCode.BAD_REQUEST);
};

const handleValidationErrorDB = (error) => {
  const errors = Object.values(error.errors).map(
    (ele, index) => `${index + 1}) ${ele.message}`
  );
  const message = `Invalid input data for: ${errors.join('. ')}`;
  return new AppError(message, StatusCode.BAD_REQUEST);
};

const handleCastError = (error) => {
  const message = `Invalid value ${error.value} for attribute ${error.path}`;
  return new AppError(message, StatusCode.BAD_REQUEST);
};

const handleJWTError = () =>
  new AppError(`Invalid token! Please login in again`, StatusCode.UNAUTHORIZED);

const handleTokenExpiredError = () =>
  new AppError(
    `Your token has been expired! please log in again`,
    StatusCode.UNAUTHORIZED
  );

const showDevelopmentError = (error, res) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    stack: error.stack,
    error: error,
  });
};

const showProductionError = (error, res) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    // eslint-disable-next-line no-console
    console.log({ SERVER_ERROR: error });
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Something went wrong :(',
    });
  }
};

// If a function in express has 4 params, its global error handler
module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  // In development mode, show complete error details
  // In production mode, show abstacted error details
  if (process.env.NODE_ENV === 'development') {
    showDevelopmentError(error, res);
  } else if (process.env.NODE_ENV === 'production') {
    let err = { ...error };
    err.name = error.name;

    if (err.code === 11000) err = handleDuplicateFieldDB(err);

    // eslint-disable-next-line default-case
    switch (err.name) {
      case 'CastError':
        err = handleCastError(err);
        break;
      case 'TokenExpiredError':
        err = handleTokenExpiredError();
        break;
      case 'ValidationError':
        err = handleValidationErrorDB(err);
        break;
      case 'JsonWebTokenError':
        err = handleJWTError();
        break;
    }
    showProductionError(error, res);
    next();
  }
};
