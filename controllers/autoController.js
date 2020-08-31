const fs = require('fs');

const autos = JSON.parse(fs.readFileSync(`${__dirname}/../data/autos.json`));

exports.checkID = (req, res, next, val) => {
  const id = Number(val);
  const auto = autos.find((el) => el.id === id);
  if (!auto) {
    res.status(404).json({
      status: 'fail',
      message: 'auto does not exist',
    });
  } else next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.make || !req.body.model || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing model, make or price',
    });
  }
  next();
};

// ROUTE HANDLERS
// GET ALL autos
exports.getAllAutos = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: autos.length,
    data: {
      autos,
    },
  });
};

// GET SINGLE auto
exports.getAuto = (req, res) => {
  const id = req.params.id * 1;
  const auto = autos.find((el) => el.id === id);
  res.status(200).json({
    status: 'success',
    data: {
      auto,
    },
  });
};

// CREATE auto
exports.createAuto = (req, res) => {
  const newId = autos[autos.length - 1].id + 1;
  const newAuto = Object.assign({ id: newId }, req.body);
  autos.push(newAuto);
  fs.writeFile(
    `${__dirname}/../data/autos.json`,
    JSON.stringify(autos),
    (err) => {
      if (err) console.log(err);

      res.status(201).json({
        status: 'success',
        message: {
          auto: newAuto,
        },
      });
    }
  );
};

// UPDATE auto
exports.updateAuto = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      auto: '<auto updated here...>',
    },
  });
};

// DELETE auto
exports.deleteAuto = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
