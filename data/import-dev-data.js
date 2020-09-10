const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Auto = require('./../models/autoModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  // .connect(process.env.DATABASE_LOCAL, {
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB Connection successful'));

// READ JSON FILE
const autos = JSON.parse(fs.readFileSync(`${__dirname}/autos.json`, 'utf-8'));

// IMPORT DATA into DB
const importData = async () => {
  try {
    await Auto.create(autos);
    console.log('Data loaded successfully');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

// DELETE DATA from DB
const deleteData = async () => {
  try {
    await Auto.deleteMany();
    console.log('Data deleted from DB');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
}

if (process.argv[2] === '--delete') {
  deleteData();
}
