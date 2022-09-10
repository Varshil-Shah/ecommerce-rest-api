const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const User = require('../model/user-model');
const catchAsync = require('../utils/catch-async');
const StatusCode = require('../utils/status-code');
const AppError = require('../utils/app-error');

const signJWTToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_COOKIE_EXPIRES_IN,
  });

const createAndSendJWTToken = (user, statusCode, res) => {
  const token = signJWTToken(user._id);

  res.cookie('jwt', token, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true });

  // Remove password from the output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res) => {
  const user = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    role: req.body.role,
    gender: req.body.gender,
    'location.type': req.body.location.type,
    'location.coordinates': req.body.location.coordinates,
    'location.street': req.body.location.street,
    'location.city': req.body.location.city,
    'location.zipcode': req.body.location.zipcode,
    'location.country': req.body.location.country,
    'name.firstName': req.body.name.firstName,
    'name.lastName': req.body.name.lastName,
  });

  // finally, if everything is OK send the token and user data back
  createAndSendJWTToken(user, StatusCode.CREATED, res);
});

exports.login = catchAsync(async (req, res, next) => {
  // extract email and password from req body
  const { email, password } = req.body;

  // check if both email and password are present
  if (!email || !password) {
    return next(
      new AppError(
        'Please provide both email and password to get logged in!',
        StatusCode.BAD_REQUEST
      )
    );
  }

  // check if the user exists and password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.verifyPassword(password, user.password))) {
    return next(
      new AppError(
        'Email not found or Invalid password',
        StatusCode.BAD_REQUEST
      )
    );
  }

  // finally, if everything is OK send the token and user data back
  createAndSendJWTToken(user, StatusCode.OK, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  // check if the token exists
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // if no token found, that means the user is not logged in
  if (!token) {
    return next(
      new AppError(
        'You are not logged in! Please login to get access',
        StatusCode.UNAUTHORIZED
      )
    );
  }

  // verify if the token is correct or not
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );

  // Get id from the decoded variable and check if user exists
  const user = await User.findById(decoded.id);

  if (!user) {
    return next(
      new AppError(
        'User belonging to the token does not exist!',
        StatusCode.UNAUTHORIZED
      )
    );
  }

  // check if the user has changed their password AFTER assigning the token
  if (user.changedPasswordAfterAssigningToken(decoded.iat)) {
    return next(
      new AppError(
        'Password changed after assigning the token. Please login again.',
        StatusCode.UNAUTHORIZED
      )
    );
  }

  req.user = user;
  next();
});

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    // If the provided roles are present on current user, send error message
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          'You are not authorized to access this resource.',
          StatusCode.UNAUTHORIZED
        )
      );
    }
    next();
  };
