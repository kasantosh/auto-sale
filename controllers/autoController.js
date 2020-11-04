const Auto = require('./../models/autoModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');

// const autos = JSON.parse(fs.readFileSync(`${__dirname}/../data/autos.json`));

// TOp 5 SUVS
exports.top5Suvs = (req, res, next) => {
  console.log(req.query);
  req.query.limit = '5';
  req.query.sort = 'mileage,price';
  req.query.bodyType = 'SUV';
  next();
};

// TOp 5 Sedans
exports.top5Sedans = (req, res, next) => {
  console.log(req.query);
  req.query.limit = '5';
  req.query.sort = 'mileage,price';
  req.query.bodyType = 'Sedan';
  next();
};

// ROUTE HANDLERS
// GET ALL autos
exports.getAllAutos = catchAsync(async (req, res, next) => {
    // EXECUTE QUERY
    const features = new APIFeatures(Auto.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const autos = await features.query;
    // const autos = await Auto.find().where('price').lte('5000');

    res.status(200).json({
      status: 'success',
      result: autos.length,
      data: {
        autos,
      },
    });
});

// GET SINGLE auto
exports.getAuto = catchAsync(async (req, res, next) => {
    const auto = await Auto.findById(req.params.id);
    if (!auto) {
      return next(new AppError('No Auto found with that ID', 404));
    } 

    res.status(200).json({
      status: 'success',
      data: { auto },
    });
});


// CREATE auto
exports.createAuto = catchAsync(async (req, res, next) => {

    const newAuto = await Auto.create(req.body);
    res.status(201).json({
      status: 'success',
      message: {
        auto: newAuto,
      },
    });
});

// UPDATE auto
exports.updateAuto = catchAsync(async (req, res, next) => {

    const auto = await Auto.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!auto) {
      return next(new AppError('No Auto found with that ID', 404));
    } 

    res.status(200).json({
      status: 'success',
      data: {
        auto: auto,
      },
    });
});

// DELETE auto
exports.deleteAuto = catchAsync(async (req, res, next) => {
    const auto = await Auto.findByIdAndDelete(req.params.id);

    if (!auto) {
      return next(new AppError('No Auto found with that ID', 404));
    } 
    res.status(204).json({
      status: 'success',
      data: null,
    });

});

exports.getAutoBodyStats = catchAsync(async (req, res, next) => {
    const stats = await Auto.aggregate([
      {
        $group: {
          _id: '$bodyType',
          numAuto: { $sum: 1 },
          minprice: { $min: '$price' },
          maxprice: { $max: '$price' },
        },
      },
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });

});
