const Product = require('../model/product-model');
const catchAsync = require('../utils/catch-async');
const StatusCode = require('../utils/status-code');
const ApiFeatures = require('../utils/api-features');
const AppError = require('../utils/app-error');

// const AppError = require('../utils/app-error');

const mapOfFilters = new Map([
  ['productId', '_id'],
  ['creatorId', 'creator._id'],
  ['username', 'creator.username'],
  ['email', 'creator.email'],
  ['firstName', 'creator.name.firstName'],
  ['lastName', 'creator.name.lastName'],
  ['categoryId', '_id'],
  ['categoryName', 'category.name'],
]);

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const products = await ApiFeatures(req.query, Product, mapOfFilters);

  res.status(StatusCode.OK).json({
    status: 'success',
    results: products.length,
    data: {
      products,
    },
  });
});

// get product from given Id
exports.getProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) {
    return next(
      new AppError('No product with this Id', StatusCode.BAD_REQUEST)
    );
  }

  res.status(StatusCode.OK).json({
    status: 'success',
    data: {
      product,
    },
  });
});
