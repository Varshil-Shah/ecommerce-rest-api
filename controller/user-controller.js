const User = require('../model/user-model');
const catchAsync = require('../utils/catch-async');
const StatusCode = require('../utils/status-code');
const ApiFeatures = require('../utils/api-features');
const AppError = require('../utils/app-error');
const { filterOutUnwantedFields } = require('../utils/utils');

const mapOfFilters = new Map([
  ['id', '_id'],
  ['firstName', 'name.firstName'],
  ['lastName', 'name.lastName'],
  ['city', 'location.city'],
  ['zipcode', 'location.zipcode'],
  ['country', 'location.country'],
]);

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await ApiFeatures(req.query, User, mapOfFilters);

  res.status(StatusCode.OK).json({
    status: 'success',
    results: users.length,
    data: { users },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new AppError('No user found with this Id', StatusCode.NOT_FOUND)
    );
  }

  res.status(StatusCode.OK).json({
    status: 'success',
    data: { user },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // If req.body contains password and confirmPassword, send error message
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        'This route is not designed to update password. Please use /update-my-password route.',
        StatusCode.BAD_REQUEST
      )
    );
  }

  // Filter out unwanted fields from req.body that shouldn't be updated
  const filteredRequestQuery = filterOutUnwantedFields(
    req.body,
    'email',
    'role',
    'gender',
    'active'
  );

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    filteredRequestQuery,
    { new: true, runValidators: true }
  );

  // If everything went fine, send success response
  res.status(StatusCode.OK).json({
    status: 'success',
    data: { user: updatedUser },
  });
});
