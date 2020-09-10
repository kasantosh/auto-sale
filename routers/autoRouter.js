const express = require('express');
const autoController = require('../controllers/autoController');

const router = express.Router();

// router.param('id', autoController.checkID);

router
  .route('/top-5-suvs')
  .get(autoController.top5Suvs, autoController.getAllAutos);

router
  .route('/top-5-sedans')
  .get(autoController.top5Sedans, autoController.getAllAutos);

router
  .route('/')
  .get(autoController.getAllAutos)
  .post(autoController.createAuto);
router
  .route('/:id')
  .get(autoController.getAuto)
  .patch(autoController.updateAuto)
  .delete(autoController.deleteAuto);

module.exports = router;
