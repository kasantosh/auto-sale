const Auto = require('../models/autoModel');
const User = require('../models/userModel');
const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const csp = "default-src 'self' https://*.fontawesome.com/; base-uri 'self'; block-all-mixed-content; connect-src 'self' https://*.fontawesome.com/; font-src 'self' https: data:;frame-ancestors 'self'; img-src 'self' data:; object-src 'none'; script-src 'self' https://kit.fontawesome.com/ blob:; script-src-attr 'none'; style-src 'self' https: 'unsafe-inline'; upgrade-insecure-requests;";

exports.getOverview = catchAsync(async (req, res, next) => {
    // 1. Get tour data from collection
    const autos = await Auto.find();
    const reviews = await Review.find();

    // 2. Render that template using auto data from 1
    res.status(200).set('Content-Security-Policy', csp).render('overview', {
      title: 'Autos on Sale',
      autos,
      reviews
    });
  });

  exports.getAuto = catchAsync(async (req, res, next) => {
    // 1. Get the data for the requested tour including user
    const auto = await Auto.findOne({ slug: req.params.slug });

    if (!auto) {
      return next(new AppError('Could not find the page/auto you are looking for!', 404));
    }
    // 2. Render data using data from 1
    res.status(200).set('Content-Security-Policy', csp).render('auto', {
      title: `${auto.make} ${auto.model}`,
      auto
    });
  });

  exports.getLoginForm =  (req, res) => {
    res.status(200).set('Content-Security-Policy', csp).render('login', {
      title: 'Log in to your account'
    })
  };

  exports.getAccount = (req, res) => {
    res.status(200).set('Content-Security-Policy', csp).render('account', {
      title: 'Your account details'
    });
  };

  exports.getMyAutos = catchAsync(async(req, res, next) => {
    const autos = await Auto.find();
    const userAutos = [];
    autos.forEach(auto => {
      console.log(auto.user.id);
      if (auto.user.id === req.user.id) userAutos.push(auto);
      return userAutos;
    });
    res.status(200).set('Content-Security-Policy', csp).render('userads', {
      title: 'Your posted ads',
      userAutos
    });
  });

  exports.postad = (req, res) => {
    res.status(200).set('Content-Security-Policy', csp).render('postad', {
      title: 'Post your ad'
    });
  }

  exports.updateUserData = catchAsync(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(req.user.id, {
        name: req.body.name,
        email: req.body.email
      },
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).set('Content-Security-Policy', csp).render('account', {
      title: 'Your account details',
      user: updatedUser
    });
  });

  exports.signup = (req, res) => {
    res.status(200).set('Content-Security-Policy', csp).render('signup', {
      title: 'Sign up for your account'
    });
  }