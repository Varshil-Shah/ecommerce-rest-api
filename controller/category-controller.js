const Category = require('../model/category-model');
const catchAsync = require('../utils/catch-async');
const StatusCode = require('../utils/status-code');
const ApiFeatures = require('../utils/api-features');
const AppError = require('../utils/app-error');

// Filtering querys
const mapOfFilters = new Map([
  ['username', 'creator.username'],
  ['email', 'creator.email'],
  ['categoryId', '_id'],
  ['creatorId', 'creator._id'],
  ['firstName', 'creator.name.firstName'],
  ['lastName', 'creator.name.lastName'],
]);

// To create new category
exports.createCategory = catchAsync(async (req, res) => {
  const category = await Category.create({
    name: req.body.name,
    image: req.body.image,
    creator: req.user._id,
  });

  res.status(StatusCode.CREATED).json({
    status: 'success',
    data: {
      category,
    },
  });
});

// Fetch all categories
exports.getAllCategories = catchAsync(async (req, res) => {
  const categories = await ApiFeatures(req.query, Category, mapOfFilters);

  res.status(StatusCode.OK).json({
    status: 'success',
    results: categories.length,
    data: {
      categories,
    },
  });
});

// Get category by Id
exports.getCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);

  // If category doesn't exist, send error message
  if (!category) {
    return next(
      new AppError('No category found with this Id', StatusCode.BAD_REQUEST)
    );
  }

  res.status(StatusCode.OK).json({
    status: 'success',
    data: {
      category,
    },
  });
});

exports.updateCategory = catchAsync(async (req, res, next) => {
  // Get Id from params
  const { id } = req.params;

  // Get category from provided Id
  const category = await Category.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    return next(
      new AppError('No category found with this Id', StatusCode.BAD_REQUEST)
    );
  }

  res.status(StatusCode.OK).json({
    status: 'success',
    data: {
      category,
    },
  });
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
  // Get Id from params
  const { id } = req.params;

  // Get category from provided Id
  const category = await Category.findByIdAndDelete(id);

  if (!category) {
    return next(
      new AppError('No category found with this Id', StatusCode.BAD_REQUEST)
    );
  }

  res.status(StatusCode.NO_CONTENT).json({
    status: 'success',
    data: {
      category,
    },
  });
});
