const Category = require('../model/category-model');
const catchAsync = require('../utils/catch-async');
const StatusCode = require('../utils/status-code');

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
  const categories = await Category.find({});

  res.status(StatusCode.OK).json({
    status: 'success',
    results: categories.length,
    data: {
      categories,
    },
  });
});
