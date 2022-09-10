const router = require('express').Router();
const authController = require('../controller/auth-controller');
const userContoller = require('../controller/user-controller');
const roles = require('../utils/roles');

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);

router.use(authController.protect);

router.patch('/update-me', userContoller.updateMe);

// Allow below routes to be accessed by admin only
router.use(authController.restrictTo(roles.admin));

router.route('/').get(userContoller.getAllUsers);

router.route('/:id').get(userContoller.getUser);

module.exports = router;
