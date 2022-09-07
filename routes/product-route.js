const router = require('express').Router();
const Product = require('../model/product-model');
const AuthController = require('../controller/auth-controller');
const ProductController = require('../controller/product-controller');
const { protectModel } = require('../controller/general-controller');

router.use(AuthController.protect);

router.route('/').get(ProductController.getAllProducts);

router
  .route('/:id')
  .get(ProductController.getProduct)
  .patch(protectModel(Product), ProductController.updateProduct)
  .delete(protectModel(Product), ProductController.deleteProduct);

module.exports = router;
