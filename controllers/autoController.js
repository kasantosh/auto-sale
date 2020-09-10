const Auto = require('./../models/autoModel');
const APIFeatures = require('../utils/apiFeatures');

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
exports.getAllAutos = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

// GET SINGLE auto
exports.getAuto = async (req, res) => {
  try {
    const auto = await Auto.findById(req.params.id);
    if (auto) {
      res.status(200).json({
        status: 'success',
        data: { auto },
      });
    } else {
      res.status(404).json({
        status: 'fail',
        message: err,
      });
    }
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

// CREATE auto
exports.createAuto = async (req, res) => {
  try {
    const newAuto = await Auto.create(req.body);
    res.status(201).json({
      status: 'success',
      message: {
        auto: newAuto,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

// UPDATE auto
exports.updateAuto = async (req, res) => {
  try {
    const auto = await Auto.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        auto: auto,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

// DELETE auto
exports.deleteAuto = async (req, res) => {
  try {
    await Auto.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
