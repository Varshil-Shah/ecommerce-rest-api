const router = require('express').Router();
const AuthController = require('../controller/auth-controller');
const ProductController = require('../controller/product-controller');

router.use(AuthController.protect);

router.route('/').get(ProductController.getAllProducts);

module.exports = router;
