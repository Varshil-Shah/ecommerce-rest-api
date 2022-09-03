const router = require('express').Router();
const AuthController = require('../controller/auth-controller');

router.route('/signup').post(AuthController.signup);

module.exports = router;
