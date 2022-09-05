const Category = require('../model/category-model');
const catchAsync = require('../utils/catch-async');
const StatusCode = require('../utils/status-code');
const ApiFeatures = require('../utils/api-features');
const AppError = require('../utils/app-error');
const Roles = require('../utils/roles');

// Filtering querys
const mapOfFilters = new Map([
  ['username', 'creator.username'],
  ['email', 'creator.email'],
  ['categoryId', '_id'],
  ['creatorId', 'creator._id'],
  ['firstName', 'creator.name.firstName'],
  ['lastName', 'creator.name.lastName'],
]);

// Protect category - only admin and category creator can delete or update
exports.protectCategory = catchAsync(async (req, res, next) => {
  // Take Id from the params
  const { id } = req.params;

  // Check if the category exists
  const category = await Category.findById(id);
  if (!category) {
    return next(
      new AppError('No category found with this Id', StatusCode.BAD_REQUEST)
    );
  }

  // Take creatorId and role from the category Object
  const creatorId = category.creator._id.toString();
  const { role, _id: currentUserId } = req.user;

  // Check if the role is admin or category creator has same of currentUser
  if (role === Roles.admin || creatorId === currentUserId.toString())
    return next();

  return next(
    new AppError(
      'Only admin and category creator can delete or update a category',
      StatusCode.UNAUTHORIZED
    )
  );
});

// To create new category
exports.createCategory = catchAsync(async (req, res) => {
  const category = await Category.create({
    name: req.body.name,
    image: req.body.image,
    creator: req.body.creator,
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
