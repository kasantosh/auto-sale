const mongoose = require('mongoose');
const User = require('./userModel');
const slugify = require('slugify');

const year = parseInt(new Date().getFullYear());

const autoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please enter a catchy title'],
    trim: true,
  },
  location: {
    type: String,
    required: [true, 'Please enter your city'],
    trim: true,
  },
  make: {
    type: String,
    required: [true, 'Please enter the make of the vehicle'],
    trim: true,
  },
  model: {
    type: String,
    required: [true, 'Please enter the model name'],
    trim: true
  },
  year: {
    type: Number,
    min: [year - 40, 'Year must be within last 40 years'],
    max: [year, 'Year can not be greater than current year'],
    required: [true, 'Please enter the year of manufacture'],
  },
  price: {
    type: Number,
    required: [true, 'Please enter a price'],
  },
  imageCover: {
    type: String,
  },
  image: [String],
  exteriorColour: {
    type: String,
    trim: true,
  },
  slug: String,
  interiorColour: {
    type: String,
    trim: true,
  },
  bodyType: {
    type: String,
    trim: true,
  },
  fuelType: {
    type: String,
    trim: true,
  },
  driveType: {
    type: String,
    trim: true,
  },
  transmission: {
    type: String,
    trim: true,
  },
  passengers: {
    type: Number,
    trim: true,
  },
  mileage: {
    type: Number,
    trim: true,
  },
  condition: String,
  description: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  }, 
  user:
    {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      // required: [true, 'Post for auto sale must belong to a user']
    }
},
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
}
);

autoSchema.index({ price: 1, model: 1 });

autoSchema.index({ slug: 1 });

// Virtual populate
// autoSchema.virtual('user', {
//   ref: 'User',
//   foreignField: 'autos',
//   localField: '_id'
// });

autoSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name email photo',
    select: '-autos -__v'
    });

    next();
});

autoSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

const Auto = mongoose.model('Auto', autoSchema);

module.exports = Auto;

