const User = require("../models/userModel");
const catchAsync = require('../utils/catchAsync');

// GET ALL Users
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
});

// GET SINGLE auto
exports.getUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Will get single user',
  });
};

// CREATE auto
exports.createUser = (req, res) => {
  res.status(201).json({
    status: 'success',
    message: 'Will create user',
  });
};

// UPDATE auto
exports.updateUser = (req, res) => {
  res.status(201).json({
    status: 'success',
    message: 'Will update user',
  });
};

// DELETE auto
exports.deleteUser = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
