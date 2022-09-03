const catchAsync = (func) => (req, res, next) => {
  func(req, res, next).catch((error) => next(error));
};

module.exports = catchAsync;
