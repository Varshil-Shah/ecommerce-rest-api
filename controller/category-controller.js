const Category = require('../model/category-model');
const catchAsync = require('../utils/catch-async');
const StatusCode = require('../utils/status-code');
const ApiFeatures = require('../utils/api-features');

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
