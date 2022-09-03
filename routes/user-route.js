const router = require('express').Router();
const AuthController = require('../controller/auth-controller');

router.route('/signup').post(AuthController.signup);
router.route('/login').post(AuthController.login);

module.exports = router;
