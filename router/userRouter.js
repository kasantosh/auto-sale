const express = require('express');
const userController = require('./../contollers/userController');

const router = express.Router();

// const { getAllUsers, createUser, getUser, updateUser, deleteUser } = userController;

// router.param('id', (req, res, next, val) => {
//   console.log('Tour id is: ', val);
//   next();
// });

router.param('id', userController.checkID);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.checkBody, userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
