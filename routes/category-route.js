const router = require('express').Router();
const CategoryController = require('../controller/category-controller');
const AuthController = require('../controller/auth-controller');

router.use(AuthController.protect);

router
  .route('/')
  .post(CategoryController.createCategory)
  .get(CategoryController.getAllCategories);

router
  .route('/:id')
  .get(CategoryController.getCategory)
  .patch(CategoryController.protectCategory, CategoryController.updateCategory)
  .delete(
    CategoryController.protectCategory,
    CategoryController.deleteCategory
  );

module.exports = router;
