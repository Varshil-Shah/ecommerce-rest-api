const router = require('express').Router();
const CategoryController = require('../controller/category-controller');

router.route('/').post(CategoryController.createCategory);

module.exports = router;
