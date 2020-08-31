const express = require('express');
const autoController = require('./../controllers/autoController');

const router = express.Router();

// const { getAllUsers, createUser, getUser, updateUser, deleteUser } = userController;

// router.param('id', (req, res, next, val) => {
//   console.log('Tour id is: ', val);
//   next();
// });

router.param('id', autoController.checkID);

router
  .route('/')
  .get(autoController.getAllAutos)
  .post(autoController.checkBody, autoController.createAuto);
router
  .route('/:id')
  .get(autoController.getAuto)
  .patch(autoController.updateAuto)
  .delete(autoController.deleteAuto);

module.exports = router;
