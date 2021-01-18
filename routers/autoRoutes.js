const express = require('express');
const autoController = require('../controllers/autoController');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

const router = express.Router();

// router.param('id', autoController.checkID);

router
  .route('/top-5-suvs')
  .get(autoController.top5Suvs, autoController.getAllAutos);

router
  .route('/top-5-sedans')
  .get(autoController.top5Sedans, autoController.getAllAutos);

router.route('/auto-body-stats').get(autoController.getAutoBodyStats);

router
  .route('/')
  .get(autoController.getAllAutos)
  .post(
    authController.protect, 
    authController.restrictTo('user', 'admin'),
    autoController.uploadAutoImages,
    autoController.resizeAutoImages,
    autoController.createAuto);

router
.route('/get-my-autos')
.get(authController.protect, autoController.getMyAutos);
  
router
  .route('/:id')
  .get(autoController.getAuto)
  .patch(
      authController.protect, 
      authController.restrictTo('admin', 'user'), 
      autoController.uploadAutoImages, 
      autoController.resizeAutoImages, 
      autoController.updateAuto)
  .delete(authController.protect, authController.restrictTo('admin', 'user'), autoController.deleteAuto);

router.route('/:autoId/reviews').post(authController.protect, authController.restrictTo('user'), reviewController.createReview);
  
module.exports = router;
