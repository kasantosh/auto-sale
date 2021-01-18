const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const User = require('./../models/userModel');

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    } 
    res.status(204).json({
      status: 'success',
      data: doc,
    });
});

exports.updateOne = Model => catchAsync(async (req, res, next) => {

  let doc = await Model.findById(req.params.id);

   if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  if (doc.user.id === req.user.id || req.user.role === 'admin') {
    doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  } else {
    return next(new AppError('You are not authorized to edit this document', 401));
  }
//////////////////
  // if (!(doc.user.id === req.user.id)) {
  //   return next(new AppError('You are not authorized to edit this document', 401));
  // }
  
  // doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
  //   new: true,
  //   runValidators: true,
  // });
  ///////////////////////
   
  res.status(201).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});

exports.createOne = (Model) => catchAsync(async (req, res, next) => {

  if (!req.body.user) req.body.user = req.user.id;
  const doc = await Model.create(req.body);
  // const user = await User.findById(req.user.id);
  // user.populate({ 
  //   path: 'user'
  // })
  res.status(201).json({
      status: 'success',
      data: {
        data: doc
      },
    });
});

exports.getOne = (Model, popOptions) => catchAsync(async (req, res, next) => {
  let query = await Model.findById(req.params.id);
  if (popOptions) query = query.populate(popOptions); 
  const doc = await query;

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  } 

  res.status(200).json({
    status: 'success',
    data: doc
  });
});

exports.getAll = Model => catchAsync(async (req, res, next) => {
  // EXECUTE QUERY
  const features = new APIFeatures(Model.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const doc = await features.query;

  res.status(200).json({
    status: 'success',
    result: doc.length,
    data: {
      data: doc,
    },
  });
});