const multer = require('multer');
const sharp = require('sharp');
const User = require("../models/userModel");
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');


// MULTERSTORAGE ASSIGN TO DIRECTLY SAVE TO DISK STORAGE
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cback) => {
//     cback(null, 'public/img/users');
//   },
//   filename: (req, file, cback) => {
//     // filename of type user-512347a8287458475847e-1162314132.jpeg(id-timestamp)
//     const ext = file.mimetype.split('/')[1]; //req.file.mimetype shows 'image/jpeg
//     cback(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   }
// }); 
 
// MULTERSTORAGE ASSIGN FOR BUFFER STORAGE
const multerStorage = multer.memoryStorage(); 

const multerFilter = (req, file, cback) => {
  if (file.mimetype.startsWith('image')) {
    cback(null, true)
  } else {
    cback(new AppError('Not an image! Please upload only images', 400), false)
  }
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`

  await sharp(req.file.buffer)
    .resize(300, 300)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

    next();
});

const filterObj = (obj, ...allowedFields) => {

  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
}

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
}

exports.updateMe = catchAsync(async (req, res, next) => {
  // console.log(req.file);
  // console.log(req.body);
  // 1) Create error if user tries to update password
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password updates. please use /updateMyPassword', 400));
  }
  // 2) Filter disallowed field names Eg. admin - user might get admin role
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;
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

// GET ALL Users
exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

// CREATE user - Will be Sign Up
exports.createUser = (req, res) => {
  res.status(201).json({
    status: 'success',
    message: 'This route is not for creating a user. Please use /signup instead.',
  });
};
