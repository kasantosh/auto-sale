const User = require("../models/userModel");
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
}

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

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user tries to update password
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password updates. please use /updateMyPassword', 400));
  }
  // 2) Filter disallowed field names Eg. admin - user might get admin role
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 2) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, { new: true, runValidators: true });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// GET SINGLE user
exports.getUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Will get single user',
  });
};

// CREATE user
exports.createUser = (req, res) => {
  res.status(201).json({
    status: 'success',
    message: 'Will create user',
  });
};

// UPDATE user
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
