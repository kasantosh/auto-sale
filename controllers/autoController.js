const multer = require('multer');
const sharp = require('sharp');
const uniqid = require('uniqid');
const Auto = require('./../models/autoModel');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

// const autos = JSON.parse(fs.readFileSync(`${__dirname}/../data/autos.json`));

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

exports.uploadAutoImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'image', maxCount: 5 }
]);  
// if only 1 field with multiple image upload.array('image', 5) --> req.files
// for only 1 file - upload.single --> req.file

exports.resizeAutoImages = catchAsync(async (req, res, next) => {

  if (!req.files.imageCover || !req.files.image) return next();

  // 1) processing 'imageCover'
  req.body.imageCover = `auto-${uniqid()}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(600, 450)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/autos/${req.body.imageCover}`);
  // req.body.imageCover = imageCoverFilename; 

  // 2) Processing other 5 'image' files
  req.body.image = [];
  await Promise.all(req.files.image.map(async (file, i) => {
    const filename = `auto-${uniqid()}-${Date.now()}-${i + 1}.jpeg`;
    await sharp(file.buffer)
    .resize(300, 200)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/autos/${filename}`);

    req.body.image.push(filename);
  }));

  // console.log(req.body);
  next();
});

exports.getMyAutos = async (req, res, next) => {
  // console.log(req.user.id);
  const autos = await Auto.find();

  const userAutos = [];
  autos.forEach(auto => {
    // console.log(auto.user.id);
    if (auto.user.id === req.user.id) userAutos.push(auto);
    return userAutos;
  });
  res.status(200).json({
    status: 'success',
    data: {
      userAutos
    }
  });
};
 
// TOp 5 SUVS
exports.top5Suvs = (req, res, next) => {
  // console.log(req.query);
  req.query.limit = '5';
  req.query.sort = 'mileage,price';
  req.query.bodyType = 'SUV';
  next();
};

// TOp 5 Sedans
exports.top5Sedans = (req, res, next) => {
  // console.log(req.query);
  req.query.limit = '5';
  req.query.sort = 'mileage,price';
  req.query.bodyType = 'Sedan';
  next();
};

// ROUTE HANDLERS
exports.getAllAutos = factory.getAll(Auto);
exports.getAuto = factory.getOne(Auto, { path: 'user' });
exports.createAuto = factory.createOne(Auto); //
exports.updateAuto = factory.updateOne(Auto);
exports.deleteAuto = factory.deleteOne(Auto);

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
