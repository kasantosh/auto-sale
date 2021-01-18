const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewsController.getOverview);
router.get('/auto/:slug', authController.isLoggedIn, viewsController.getAuto);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/me', authController.protect, viewsController.getAccount);
router.get('/signup', authController.isLoggedIn, viewsController.signup);
router.get('/postad', authController.protect, viewsController.postad);
router.get('/my-ads', authController.protect, viewsController.getMyAutos);

router.post('/submit-user-data', authController.protect, viewsController.updateUserData);

module.exports = router;