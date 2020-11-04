module.exports = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
        // fn(req, res, next).catch(err => next(err)); same as above - err is passed in to next and passed on to global error handler
    };
  }