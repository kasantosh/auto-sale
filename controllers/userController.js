// ROUTE HANDLERS
// GET ALL Users
exports.getAllUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Will get all users',
  });
};

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
    message: 'Will updatete user',
  });
};

// DELETE auto
exports.deleteUser = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
