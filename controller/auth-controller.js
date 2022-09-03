const jwt = require('jsonwebtoken');

const User = require('../model/user-model');
const catchAsync = require('../utils/catch-async');
const StatusCode = require('../utils/status-code');
const AppError = require('../utils/app-error');

const signJWTToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_COOKIE_EXPIRES_IN,
  });

const createAndSendJWTToken = (user, statusCode, res) => {
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  const token = signJWTToken(user._id);

  res.cookie('jwt', token, cookieOptions);

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
