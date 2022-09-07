const router = require('express').Router();
const CategoryController = require('../controller/category-controller');
const AuthController = require('../controller/auth-controller');
const Category = require('../model/category-model');
const { protectModel } = require('../controller/general-controller');

router.use(AuthController.protect);

router
  .route('/')
  .post(CategoryController.createCategory)
  .get(CategoryController.getAllCategories);

router
  .route('/:id')
  .get(CategoryController.getCategory)
  .patch(protectModel(Category), CategoryController.updateCategory)
  .delete(protectModel(Category), CategoryController.deleteCategory);

module.exports = router;
