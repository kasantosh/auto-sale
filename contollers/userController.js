const fs = require('fs');

const users = JSON.parse(fs.readFileSync(`${__dirname}/../data/users.json`));

exports.checkID = (req, res, next, val) => {
  const id = Number(val);
  const user = users.find((el) => el.id === id);
  if (!user) {
    res.status(404).json({
      status: 'fail',
      message: 'User does not exist',
    });
  } else next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.login || !req.body.url) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing login or url',
    });
  }
  next();
};

// ROUTE HANDLERS
// GET ALL USERS
exports.getAllUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
};

// GET SINGLE USER
exports.getUser = (req, res) => {
  const id = req.params.id * 1;
  const user = users.find((el) => el.id === id);
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
};

// CREATE USER
exports.createUser = (req, res) => {
  const newId = users[users.length - 1].id + 1;
  const newUser = Object.assign({ id: newId }, req.body);
  users.push(newUser);

  fs.writeFile(`${__dirname}/data/users.json`, JSON.stringify(users), (err) => {
    res.status(201).json({
      status: 'success',
      message: {
        user: newUser,
      },
    });
  });
};

// UPDATE USER
exports.updateUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: '<User updated here...>',
    },
  });
};

// DELETE USER
exports.deleteUser = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
