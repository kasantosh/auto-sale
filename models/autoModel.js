const mongoose = require('mongoose');

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
    required: [true, 'Please enter the make of the vehicle you want to sell'],
    trim: true,
  },
  model: {
    type: String,
    required: [true, 'Please enter the model name'],
    trim: true,
  },
  year: {
    type: Number,
    required: [true, 'Please enter the year of manufacture'],
  },
  price: {
    type: Number,
    required: [true, 'Please enter a price'],
  },
  image: [String],
  exteriorColour: {
    type: String,
    trim: true,
  },
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
});

const Auto = mongoose.model('Auto', autoSchema);

module.exports = Auto;
