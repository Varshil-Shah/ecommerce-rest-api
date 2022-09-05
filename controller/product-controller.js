const Product = require('../model/product-model');
const catchAsync = require('../utils/catch-async');
const StatusCode = require('../utils/status-code');
// const AppError = require('../utils/app-error');

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find();

  res.status(StatusCode.OK).json({
    status: 'success',
    results: products.length,
    data: {
      products,
    },
  });
});
