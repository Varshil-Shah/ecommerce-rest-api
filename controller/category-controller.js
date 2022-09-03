const CategoryModel = require('../model/category-model');
const catchAsync = require('../utils/catch-async');
const StatusCode = require('../utils/status-code');

exports.createCategory = catchAsync(async (req, res) => {
  const category = await CategoryModel.create({
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
