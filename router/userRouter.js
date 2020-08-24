const express = require('express');
const userController = require('./../contollers/userController');

const router = express.Router();

// const { getAllUsers, createUser, getUser, updateUser, deleteUser } = userController;

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
