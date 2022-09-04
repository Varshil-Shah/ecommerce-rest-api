const router = require('express').Router();
const CategoryController = require('../controller/category-controller');

router
  .route('/')
  .post(CategoryController.createCategory)
  .get(CategoryController.getAllCategories);

module.exports = router;
