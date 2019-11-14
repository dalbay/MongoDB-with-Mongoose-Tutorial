// require the fileSystem module (to access the JSON file)
const fs = require('fs');

// require mongoose package
const mongoose = require('mongoose');

// require the environmetal variable module
const dotenv = require('dotenv');
// require the tourModel (we will write to tours)
const Tour = require('../../models/tourModel');

// read and save the environmental variables in node.js
dotenv.config({ path: './config.env' });

// we need to access the database only once.
// change the password in the connection string
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// connect to mongoose:
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connection successful'));

//READ JSON file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded');
  } catch (err) {
    console.log(err);
  }
  process.exit(); // stopping app in terminal
};

// DELETE  ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit(); // stopping app in terminal
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

// instead of calling the functions we will interact with the comment line
console.log(process.argv);
